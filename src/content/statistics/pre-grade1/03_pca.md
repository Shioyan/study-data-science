---
title: "主成分分析（PCA）"
grade: "pre-grade1"
topic_id: "03_pca"
order: 3
---

## 次元削減の目的

現実のデータは数十〜数千の変数を持つことが多いですが、多くの変数間には相関があり情報が重複しています。主成分分析（PCA: Principal Component Analysis）は、元の $p$ 個の変数を互いに無相関な少数の合成変数（主成分）に変換し、情報の損失を最小限に抑えながら次元を削減する手法です。

データの可視化（2〜3次元への圧縮）、特徴量エンジニアリング、多重共線性の解消など幅広い用途があります。

## 主成分の定義（分散最大化の方向）

標準化されたデータ行列 $\mathbf{X}$（$n \times p$）を考えます。第1主成分は、データの分散を最大化する方向のベクトル $\mathbf{a}_1$（$\|\mathbf{a}_1\| = 1$）への射影として定義されます：

$$z_1 = \mathbf{X}\mathbf{a}_1, \quad \text{Var}(z_1) = \mathbf{a}_1^\top \boldsymbol{\Sigma} \mathbf{a}_1 \to \max$$

ここで $\boldsymbol{\Sigma}$ は共分散行列（標準化済みデータの場合は相関行列）です。第2主成分は第1主成分と直交する（無相関）条件のもとで、残差分散を最大化する方向として定義されます。以降同様に構成されます。

### 直感的な理解

多次元のデータ点群を想像してください。点群が楕円形に広がっているとき、PCAは「楕円の長軸方向」を第1主成分、「楕円の短軸方向」を第2主成分として見つけます。データが最も大きく広がっている方向こそが、データの「情報量」が最も多い方向です。

## 固有値分解のイメージ

ラグランジュ乗数法を使うと、主成分方向は共分散行列 $\boldsymbol{\Sigma}$ の**固有ベクトル**に等しく、各主成分の分散は対応する**固有値** $\lambda_j$ に等しいことが示されます：

$$\boldsymbol{\Sigma} \mathbf{a}_j = \lambda_j \mathbf{a}_j$$

固有値は $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_p \geq 0$ の順に並べます。固有値が大きいほどその主成分が多くの分散（情報量）を捉えています。

### 固有値分解の意味

共分散行列 $\boldsymbol{\Sigma}$ は「データがどの方向にどれだけ広がっているか」を完全に記述した行列です。固有分解はこの行列を「方向（固有ベクトル）」と「その方向への広がり具合（固有値）」に分解する操作です。

- 固有ベクトル $\mathbf{a}_j$：データが最も広がっている $j$ 番目の方向
- 固有値 $\lambda_j$：その方向への分散（広がりの大きさ）

## 標準化してからPCAする理由

PCAは分散を最大化する方向を探します。変数のスケールが大きいと、その変数の分散が大きくなりやすく、第1主成分を「支配」してしまいます。

**具体例**：身長（170cm程度）と体重（60kg程度）と年収（500万円程度）でPCAをすると、単位が大きい年収の分散が圧倒的に大きく、第1主成分はほぼ「年収の軸」になってしまいます。

**対処法**：各変数を標準化（平均0・分散1）してからPCAを実施します。これにより単位の違いを吸収し、すべての変数が対等に扱われます。

```python
from sklearn.preprocessing import StandardScaler
# 標準化を忘れずに！
X_scaled = StandardScaler().fit_transform(X)
```

## 寄与率と累積寄与率

第 $j$ 主成分が全分散に占める割合を**寄与率**といいます：

$$\text{寄与率}_j = \frac{\lambda_j}{\sum_{l=1}^p \lambda_l}$$

第1主成分から第 $m$ 主成分までの寄与率の和が**累積寄与率**であり、これが何%になれば「十分な情報を保持している」かが主成分数選択の基準となります。

$$\text{累積寄与率}_m = \frac{\sum_{j=1}^m \lambda_j}{\sum_{l=1}^p \lambda_l}$$

### 主成分数の選択基準

| 基準 | 内容 | 特徴 |
|------|------|------|
| 累積寄与率 70〜80%以上 | 情報の70〜80%を保持できる主成分数を採用 | 最も直感的 |
| カイザー規準（固有値1以上） | 固有値 > 1 の主成分のみ採用 | 平均的な変数1個分以上の情報を持つことを基準とする |
| スクリープロット | 固有値の減少が緩やかになる「肘」の前まで | 視覚的に判断 |

## スクリープロットの読み方

固有値をその大きさの順に棒グラフで表したものが**スクリープロット**です。固有値が急減した後に平坦になる「肘（elbow）」の部分が、採用する主成分数の目安となります。平坦部分は雑音成分であり、それ以降の主成分は情報の追加にほとんど貢献しません。

```python
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

pca_full = PCA()
pca_full.fit(X_scaled)

# スクリープロット
plt.figure(figsize=(8, 4))
plt.plot(range(1, len(pca_full.explained_variance_) + 1),
         pca_full.explained_variance_, 'bo-')
plt.xlabel('主成分の番号')
plt.ylabel('固有値')
plt.title('スクリープロット')
plt.axhline(y=1, color='r', linestyle='--', label='カイザー規準（固有値=1）')
plt.legend()
plt.show()
```

「肘」より左側の急な傾斜部分の主成分が真に情報を持っており、右側の平坦部分は雑音です。

## 主成分スコアの解釈

各観測値を主成分空間に射影した値を**主成分スコア**といいます：

$$\mathbf{Z} = \mathbf{X}\mathbf{A}$$

ここで $\mathbf{A} = [\mathbf{a}_1, \ldots, \mathbf{a}_m]$ は選択した固有ベクトルを列に並べた行列です。主成分スコアをプロット（バイプロット）すると、観測値のクラスター構造や異常値を視覚的に捉えることができます。

各主成分が「何を表すか」は、元の変数との相関（因子負荷量 $\mathbf{a}_j \sqrt{\lambda_j}$）を見て解釈します。たとえば第1主成分と身長・体重・BMIの相関が高ければ「体格因子」と命名することができます。

## Pythonによる実装例

```python
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pandas as pd

# 1. 標準化（必須）
X_scaled = StandardScaler().fit_transform(X)

# 2. PCA の実行
pca = PCA(n_components=2)  # 最初は全成分で実行して寄与率を確認するのが良い
scores = pca.fit_transform(X_scaled)

# 3. 寄与率の確認
print("各主成分の寄与率:", pca.explained_variance_ratio_)
print("累積寄与率:", pca.explained_variance_ratio_.cumsum())

# 4. 因子負荷量（各変数と主成分の相関）
loadings = pd.DataFrame(
    pca.components_.T * pca.explained_variance_**0.5,
    index=feature_names,
    columns=['PC1', 'PC2']
)
print(loadings)

# 5. 主成分スコアの散布図
import matplotlib.pyplot as plt
plt.scatter(scores[:, 0], scores[:, 1], alpha=0.5)
plt.xlabel('第1主成分スコア')
plt.ylabel('第2主成分スコア')
plt.title('PCAによる2次元プロット')
plt.show()
```

## 出力結果の読み方

- `explained_variance_ratio_`：各主成分の寄与率（0〜1）。第1成分が0.45なら45%の情報を保持。
- `components_`：固有ベクトル（各主成分の方向）。各行が1つの主成分を表し、各列が元の変数への係数。
- `explained_variance_`：固有値（各主成分の分散の大きさ）。

## 適用の前提条件と注意事項

1. **標準化の実施**：スケールの異なる変数を扱うときは必須
2. **線形性の前提**：PCAは線形変換のため、非線形な構造は捉えられない（その場合はカーネルPCAを検討）
3. **外れ値への感度**：PCAは分散を最大化するため、外れ値の影響を受けやすい
4. **解釈可能性の限界**：主成分は元の変数の線形結合であり、必ずしも直感的な意味を持たない

## 実務での落とし穴

- **標準化なしでPCAを実施する**：スケールの大きな変数が第1主成分を支配します。必ず標準化してから実施してください。
- **主成分スコアを予測変数として使った後に元データで検証する**：テストデータにも同じscalerとPCA変換を適用する必要があります（`fit` はtrainのみ、`transform` をtestにも適用）。
- **因子分析と混同する**：PCAは記述的手法（「データをうまく要約する」）、因子分析は説明的手法（「観測変数の背後にある潜在因子を発見する」）です。目的に応じて使い分けてください。

## 2級との違い・発展内容

統計検定2級ではPCAの基本的な概念（次元削減、寄与率）が求められます。準1級では以下が加わります：

- 固有値・固有ベクトルの数学的導出（共分散行列の固有分解）
- ラグランジュ乗数法による主成分の導出
- 因子負荷量の計算と解釈
- スクリープロットとカイザー規準による主成分数の選択
- バイプロットの読み方
