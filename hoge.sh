# 指定の文字列 を含むファイルを検索し、そのファイルのパスを表示する
# node_modules以下は検索対象外
# ファイルパスのみ表示する
# 重複して表示されるファイルは一度だけ表示する

str="esm"

# grep -r $str . | cut -d: -f1 | sort | uniq
grep -r $str . --exclude-dir=node_modules | cut -d: -f1 | sort | uniq