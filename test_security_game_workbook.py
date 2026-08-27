import re
import unittest
import zipfile
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path


WORKBOOK_PATH = Path(__file__).parent / "ゲーム仕様書" / "security_game_test_cases.xlsx"
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
DETAIL_SHEETS = [
    "CH0",
    "CH1",
    "CH2",
    "CH3",
    "CH4",
    "CH5",
    "CH6",
    "CH7",
    "CH8",
    "CH9",
    "CH10",
    "Duel_DSL",
    "全体_E2E共通",
]
EXPECTED_SHEETS = ["00_サマリ", "01_全テストケース", *DETAIL_SHEETS, "既存テスト_GAP", "実行ベースライン"]
REQUIRED_COLUMNS = [
    "TestCase ID",
    "章",
    "Stage/対象",
    "分類",
    "テスト技法",
    "優先度",
    "テスト項目",
    "事前条件",
    "操作・入力",
    "期待結果",
    "判定オラクル",
    "自動化レベル",
    "既存カバレッジ",
    "根拠仕様/実装",
]


def _column_index(reference):
    letters = re.match(r"[A-Z]+", reference).group(0)
    result = 0
    for letter in letters:
        result = result * 26 + ord(letter) - 64
    return result - 1


def _shared_strings(archive):
    try:
        root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    return ["".join(node.itertext()) for node in root.findall(f"{{{MAIN_NS}}}si")]


def _sheet_paths(archive):
    workbook = ET.fromstring(archive.read("xl/workbook.xml"))
    rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
    targets = {
        rel.attrib["Id"]: rel.attrib["Target"].lstrip("/").removeprefix("xl/")
        for rel in rels.findall(f"{{{PKG_REL_NS}}}Relationship")
    }
    return {
        sheet.attrib["name"]: f"xl/{targets[sheet.attrib[f'{{{REL_NS}}}id']]}"
        for sheet in workbook.find(f"{{{MAIN_NS}}}sheets")
    }


def _read_sheet(archive, path, strings):
    root = ET.fromstring(archive.read(path))
    rows = []
    for row_node in root.find(f"{{{MAIN_NS}}}sheetData").findall(f"{{{MAIN_NS}}}row"):
        row = []
        for cell in row_node.findall(f"{{{MAIN_NS}}}c"):
            index = _column_index(cell.attrib["r"])
            while len(row) <= index:
                row.append(None)
            value_node = cell.find(f"{{{MAIN_NS}}}v")
            cell_type = cell.attrib.get("t")
            if cell_type == "inlineStr":
                inline = cell.find(f"{{{MAIN_NS}}}is")
                value = "".join(inline.itertext()) if inline is not None else ""
            elif value_node is None:
                value = None
            elif cell_type == "s":
                value = strings[int(value_node.text)]
            elif cell_type == "b":
                value = value_node.text == "1"
            elif cell_type in {"str", "e"}:
                value = value_node.text or ""
            else:
                raw = value_node.text or ""
                try:
                    number = float(raw)
                    value = int(number) if number.is_integer() else number
                except ValueError:
                    value = raw
            row[index] = value
        while row and row[-1] is None:
            row.pop()
        rows.append(row)
    return rows


def load_workbook_rows():
    with zipfile.ZipFile(WORKBOOK_PATH) as archive:
        strings = _shared_strings(archive)
        return {name: _read_sheet(archive, path, strings) for name, path in _sheet_paths(archive).items()}


class SecurityGameWorkbookTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sheets = load_workbook_rows()

    def test_expected_sheets_are_present_in_order(self):
        self.assertEqual(list(self.sheets), EXPECTED_SHEETS)

    def test_master_table_has_380_unique_complete_cases(self):
        rows = self.sheets["01_全テストケース"]
        header = rows[0]
        self.assertEqual(header[: len(REQUIRED_COLUMNS)], REQUIRED_COLUMNS)
        records = [dict(zip(header, row + [None] * (len(header) - len(row)))) for row in rows[1:]]
        self.assertEqual(len(records), 380)
        ids = [record["TestCase ID"] for record in records]
        self.assertEqual(len(ids), len(set(ids)))
        for record in records:
            for column in REQUIRED_COLUMNS:
                self.assertNotIn(record.get(column), (None, ""), f"{record['TestCase ID']}: {column}")
            self.assertIn(record["優先度"], {"P0", "P1"})
            self.assertRegex(record["自動化レベル"], r"^(Unit|Integration|E2E)(/(Unit|Integration|E2E))*$")

    def test_detail_sheets_partition_master_cases_without_drift(self):
        master_rows = self.sheets["01_全テストケース"]
        master_header = master_rows[0]
        master = {row[0]: row for row in master_rows[1:]}
        detail = {}
        for sheet_name in DETAIL_SHEETS:
            rows = self.sheets[sheet_name]
            self.assertEqual(rows[0], master_header, sheet_name)
            for row in rows[1:]:
                case_id = row[0]
                self.assertNotIn(case_id, detail, case_id)
                detail[case_id] = row
        self.assertEqual(set(detail), set(master))
        for case_id, row in detail.items():
            self.assertEqual(row, master[case_id], case_id)

    def test_priority_and_chapter_totals_match_summary_design(self):
        rows = self.sheets["01_全テストケース"]
        header = rows[0]
        records = [dict(zip(header, row + [None] * (len(header) - len(row)))) for row in rows[1:]]
        self.assertEqual(Counter(record["優先度"] for record in records), Counter({"P0": 285, "P1": 95}))
        self.assertEqual(sum(1 for record in records if record["章"] == "Duel DSL"), 48)
        self.assertEqual(sum(1 for record in records if record["章"] == "全体"), 74)


if __name__ == "__main__":
    unittest.main()
