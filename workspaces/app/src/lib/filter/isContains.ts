import { compareWithFlags, PRIMARY as UCA_L1_FLAG, SECONDARY as UCA_L2_FLAG } from 'unicode-collation-algorithm2';

// UCA_L1_FLAG はベース文字、UCA_L2_FLAG は濁点・半濁点・アクセントを区別する (sensitivity: accent に相当)
const SENSITIVITY_ACCENT_FLAG = UCA_L1_FLAG ^ UCA_L2_FLAG;

type Params = {
  query: string;
  target: string;
};

// ひらがな・カタカナ・半角・全角を区別せずに文字列が含まれているかを調べる
export function isContains({ query, target }: Params): boolean {
  // target の先頭から順に query が含まれているかを調べる
  TARGET_LOOP: for (let offset = 0; offset <= target.length - query.length; offset++) {
    for (let idx = 0; idx < query.length; idx++) {
      // 1文字ずつ Unicode Collation Algorithm で比較する
      // unicode-collation-algorithm2 は Default Unicode Collation Element Table (DUCET) を collation として使う
      if (compareWithFlags(target[offset + idx]!, query[idx]!, SENSITIVITY_ACCENT_FLAG) !== 0) {
        continue TARGET_LOOP;
      }
    }
    // query のすべての文字が含まれていたら true を返す
    return true;
  }
  // target の最後まで query が含まれていなかったら false を返す
  return false;
}
