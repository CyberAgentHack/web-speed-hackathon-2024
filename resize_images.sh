#!/bin/bash

cd workspaces/server/seeds

# 元の画像が保存されているディレクトリ
input_dir="images"
# リサイズ後の画像を保存するディレクトリ
output_dir="images_resized"

# 出力先ディレクトリが存在しない場合、作成する
if [ ! -d "$output_dir" ]; then
    mkdir -p "$output_dir"
fi

# imagesディレクトリ内の全画像ファイルをリサイズ
for input_file in "$input_dir"/*.{jpg,jpeg,png,gif}; do
    if [ -f "$input_file" ]; then
        # ファイル名だけを取得
        filename=$(basename "$input_file")
        
        # ffmpegを使用して横幅を200pxにリサイズし、アスペクト比を維持
        ffmpeg -i "$input_file" -vf scale=200:-1 "$output_dir/$filename"
        
        echo "Resized $filename and saved to $output_dir"
    fi
done

echo "All images resized successfully!"
