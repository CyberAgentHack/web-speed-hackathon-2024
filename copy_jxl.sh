# workspaces/server/seeds/images_legacy/内の.jxlファイルをworkspaces/server/seeds/images/にコピーするスクリプトを作成してください。

# 作業ディレクトリに移動
cd workspaces/server/seeds

# images_legacyディレクトリ内の.jxlファイルをimagesディレクトリにコピー
for input_file in images_legacy/*.jxl; do
    if [ -f "$input_file" ]; then
        # ファイル名だけを取得
        filename=$(basename "$input_file")
        
        # ファイルをコピー
        cp "$input_file" "images/$filename"
        
        echo "Copied $filename to images directory"
    fi
done