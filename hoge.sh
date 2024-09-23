# 全ての、内容に「client.global.js」という文字列を含むファイルを検索する
# node_modulesディレクトリは除外する
# distディレクトリは除外する
# ファイルは再帰的に検索する

find . -type f -not -path "./node_modules/*" -not -path "./dist/*" -exec grep -l "jquery" {} \;