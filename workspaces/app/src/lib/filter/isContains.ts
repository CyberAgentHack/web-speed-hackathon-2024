// import { compareWithFlags, PRIMARY as UCA_L1_FLAG, SECONDARY as UCA_L2_FLAG } from 'unicode-collation-algorithm2';

// // UCA_L1_FLAG はベース文字、UCA_L2_FLAG は濁点・半濁点・アクセントを区別する (sensitivity: accent に相当)
// const SENSITIVITY_ACCENT_FLAG = UCA_L1_FLAG ^ UCA_L2_FLAG;

// type Params = {
//   query: string;
//   target: string;
// };

// // ひらがな・カタカナ・半角・全角を区別せずに文字列が含まれているかを調べる
// export function isContains({ query, target }: Params): boolean {
//   // target の先頭から順に query が含まれているかを調べる
//   TARGET_LOOP: for (let offset = 0; offset <= target.length - query.length; offset++) {
//     for (let idx = 0; idx < query.length; idx++) {
//       // 1文字ずつ Unicode Collation Algorithm で比較する
//       // unicode-collation-algorithm2 は Default Unicode Collation Element Table (DUCET) を collation として使う
//       if (compareWithFlags(target[offset + idx]!, query[idx]!, SENSITIVITY_ACCENT_FLAG) !== 0) {
//         continue TARGET_LOOP;
//       }
//     }
//     // query のすべての文字が含まれていたら true を返す
//     return true;
//   }
//   // target の最後まで query が含まれていなかったら false を返す
//   return false;
// }

// Unicode比較に必要なフラグのカスタム定義
const UCA_L1_FLAG = 0b0001;
const UCA_L2_FLAG = 0b0010;
const SENSITIVITY_ACCENT_FLAG = UCA_L1_FLAG ^ UCA_L2_FLAG;

type Params = {
  query: string;
  target: string;
};

// カスタム関数で文字を比較
function customCompareWithFlags(charA: string, charB: string, flags: number): number {
  // flags に基づいたカスタム比較ロジックを実装
  if (flags === SENSITIVITY_ACCENT_FLAG) {
    return charA.normalize("NFD").localeCompare(charB.normalize("NFD"), undefined, {
      sensitivity: "accent",
      usage: "sort",
    });
  } else if (flags === UCA_L1_FLAG) {
    return charA.localeCompare(charB, undefined, { sensitivity: "base", usage: "sort" });
  } else {
    return charA.localeCompare(charB, undefined, { sensitivity: "variant", usage: "sort" });
  }
}

// ひらがな・カタカナ・半角・全角を区別せずに文字列が含まれているかを調べる
export function isContains({ query, target }: Params): boolean {
  TARGET_LOOP: for (let offset = 0; offset <= target.length - query.length; offset++) {
    for (let idx = 0; idx < query.length; idx++) {
      // カスタム関数で比較
      if (customCompareWithFlags(target[offset + idx]!, query[idx]!, SENSITIVITY_ACCENT_FLAG) !== 0) {
        continue TARGET_LOOP;
      }
    }
    return true;
  }
  return false;
}
