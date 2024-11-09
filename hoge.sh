# tensorflow を含むjs,ts,tsxファイルを検索し、そのファイルのパスを表示する
# node_modules以下は検索対象外
# 

grep -r --include=\*.{js,ts,tsx} tensorflow . --exclude-dir=node_modules --exclude-dir=dist