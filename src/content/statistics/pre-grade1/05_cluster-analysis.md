---
title: "クラスター分析"
grade: "pre-grade1"
topic_id: "05_cluster-analysis"
order: 5
---

## 教師なし学習としての位置付け

クラスター分析は、ラベル（正解）なしにデータを類似したグループ（クラスター）に自動的に分割する**教師なし学習**の代表的手法です。顧客セグメンテーション、遺伝子発現パターンの分類、文書のトピック分類など幅広い用途があります。

分類問題（教師あり学習）との根本的な違いは「正解クラスが事前に定義されていない」点であり、「データの中から自然な構造を発見する」ことが目的です。

## 距離の定義と使い分け

クラスター分析では「類似度」を距離で定量化します。どの距離を使うかによって結果が変わるため、データの性質に応じた選択が重要です。

### ユークリッド距離（最も一般的）

$$d_E(\mathbf{x}, \mathbf{y}) = \sqrt{\sum_{j=1}^p (x_j - y_j)^2}$$

「直線距離」であり最も直感的です。ただしスケールの大きな変数に引きずられやすく、標準化が必須です。

### マンハッタン距離（L1距離）

$$d_M(\mathbf{x}, \mathbf{y}) = \sum_{j=1}^p |x_j - y_j|$$

「碁盤の目を走るタクシーの移動距離」のイメージです。外れ値への影響がユークリッド距離より小さく、高次元データに適しています。異常検知など外れ値が多いデータに向いています。

### コサイン類似度

$$\cos(\mathbf{x}, \mathbf{y}) = \frac{\mathbf{x} \cdot \mathbf{y}}{\|\mathbf{x}\| \|\mathbf{y}\|}$$

ベクトルの「方向の類似度」を測ります。テキストデータ（TF-IDFベクトルなど）の類似度計算に特に有効です。値の大きさではなく比率的な構造が類似しているかを判断したいときに使います。

### マハラノビス距離

$$d_M(\mathbf{x},\mathbf{y}) = \sqrt{(\mathbf{x}-\mathbf{y})^\top \boldsymbol{\Sigma}^{-1}(\mathbf{x}-\mathbf{y})}$$

変数間の相関と分散を考慮した距離です。スケールの違いを自動的に吸収するため標準化が不要で、変数間の相関が強い場合に適しています。

| 距離指標 | 適したデータ | 注意点 |
|---------|------------|--------|
| ユークリッド | 連続変数・低次元 | 標準化が必須 |
| マンハッタン | 外れ値が多い場合・高次元 | 標準化が必要 |
| コサイン類似度 | テキスト・スパースデータ | 大きさではなく方向を比較 |
| マハラノビス | 変数間相関が強い場合 | 逆行列の計算が必要 |

## 階層的クラスタリング

すべての観測値を個別のクラスターとして出発し、距離の近いクラスターを順次統合していく手法です。クラスター間の距離定義（リンケージ法）によって結果が異なります：

- **最短距離法（single linkage）**：2クラスター間の最小距離。鎖状のクラスターができやすい（連鎖効果）。
- **最長距離法（complete linkage）**：2クラスター間の最大距離。コンパクトで均等なクラスターができやすい。
- **Ward法**：統合後のクラスター内変動の増分を最小化する。バランスのよいクラスターが得られ実務で最も多用される。

### Ward法の意味

Ward法は「クラスターを統合したときにクラスター内分散がどれだけ増加するか」を最小化するようにクラスターを選びます。クラスター内の均質性を最大化する観点から、最もコンパクトで解釈しやすいクラスターが得られます。

$$\Delta(\text{WCSS}) = \frac{n_A \cdot n_B}{n_A + n_B} \|\bar{\mathbf{x}}_A - \bar{\mathbf{x}}_B\|^2$$

統合コストは2クラスターの重心間距離の二乗を、調和平均で重みづけたものです。「重心が近く、かつサイズが小さいクラスター」を優先的に統合します。

## デンドログラム（樹形図）の読み方

階層的クラスタリングの結果は**デンドログラム**（樹形図）で可視化されます。縦軸はクラスター統合時の距離（または非類似度）を表します。水平な切断線を引いた高さでクラスター数を決定できます：切断線と交わる縦線の本数がクラスター数です。縦軸の高さが高い箇所での統合は「無理な統合」を意味するため、その直前の本数がクラスター数の目安となります。

## 非階層的クラスタリング（k-means法）

k-means法は事前にクラスター数 $k$ を指定し、以下のアルゴリズムを反復します。

### E-step（割り当てステップ）とM-step（更新ステップ）

k-meansはEM（Expectation-Maximization）アルゴリズムの一種として理解できます：

1. **初期化**：ランダムに $k$ 個のセントロイド（重心）を配置
2. **E-step（割り当て）**：各観測値を最近傍セントロイドのクラスターに割り当てる
3. **M-step（更新）**：各クラスターの平均でセントロイドを更新
4. **収束判定**：割り当てが変化しなくなるまで2〜3を繰り返す

**E-stepの直感**：「今のクラスター中心を所与として、どのクラスターに属するか最も近いものを選ぶ」。**M-stepの直感**：「今のクラスター割り当てを所与として、最も誤差が小さくなる新しい中心を計算する」。

目的関数はクラスター内二乗和（WCSS）の最小化です：

$$\text{WCSS} = \sum_{l=1}^k \sum_{i \in C_l} \|\mathbf{x}_i - \boldsymbol{\mu}_l\|^2$$

k-meansは大規模データに高速ですが、局所最適解への収束があるため初期値を変えて複数回実行します（`n_init` パラメータ）。

## クラスター数の決め方

### エルボー法（Elbow Method）

$k$ を変えながら WCSS をプロットしたとき、減少が急激に緩やかになる「肘（elbow）」の点が最適なクラスター数の目安となります。

```python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

wcss = []
K_range = range(1, 11)
for k in K_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    km.fit(X_scaled)
    wcss.append(km.inertia_)

plt.plot(K_range, wcss, 'bo-')
plt.xlabel('クラスター数 k')
plt.ylabel('WCSS（クラスター内二乗和）')
plt.title('エルボー法')
plt.show()
```

### シルエット係数

クラスターの凝集度（同じクラスター内の観測値との距離）と分離度（最近傍の別クラスターとの距離）のバランスを評価します：

$$s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}$$

- $a(i)$：点 $i$ と同じクラスター内の平均距離（凝集度、小さいほど良い）
- $b(i)$：点 $i$ から最近傍クラスターまでの平均距離（分離度、大きいほど良い）
- $s(i)$ は $-1$ から $1$ の値をとり、1に近いほど良いクラスタリング

```python
from sklearn.metrics import silhouette_score

scores = []
for k in range(2, 11):
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels = km.fit_predict(X_scaled)
    scores.append(silhouette_score(X_scaled, labels))

# シルエット係数が最大のkが最適
best_k = range(2, 11)[scores.index(max(scores))]
print(f'最適クラスター数: {best_k}')
```

## Pythonによる実装例

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt

# 1. 標準化（必須）
X_scaled = StandardScaler().fit_transform(X)

# 2. k-meansクラスタリング
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42)
kmeans.fit(X_scaled)

# 3. クラスタラベルの取得
labels = kmeans.labels_
print("クラスタラベル:", labels)

# 4. クラスターごとの統計（元スケールで解釈）
import pandas as pd
df['cluster'] = labels
print(df.groupby('cluster').mean())  # 各クラスターの特徴を解釈

# 5. 2次元可視化（PCAで次元削減してプロット）
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
coords = pca.fit_transform(X_scaled)
plt.scatter(coords[:, 0], coords[:, 1], c=labels, cmap='viridis')
plt.title('k-meansクラスタリング結果（PCA 2次元）')
plt.show()
```

## 適用の前提条件

1. **数値データ**：k-meansはユークリッド距離を前提とするため、カテゴリカル変数には不向き（k-modesを使う）
2. **球状クラスター**：k-meansは球状のクラスターを想定。複雑な形状には対応できない
3. **スケールの統一**：標準化が必須
4. **外れ値の排除**：k-meansは外れ値に敏感なため、前処理で対応する

## 実務での落とし穴

- **k-meansは球状のクラスターを前提とし、スケールの差に敏感です**。非球状クラスターや密度が不均一なデータには DBSCAN や GMM（ガウス混合モデル）の方が適します。
- **クラスター数 $k$ の恣意性**：エルボー法でも「肘」がはっきりしないことがあります。シルエット係数など複数の指標を組み合わせてください。
- **結果の再現性**：k-meansは初期値に依存します。`random_state` を固定し `n_init` を十分大きくしてください。
- **クラスター分析の結果はあくまで「発見」**：クラスター分析は仮説生成のツールです。見つかったクラスターの意味はドメイン知識で解釈し、独立したデータで検証してください。

## 2級との違い・発展内容

統計検定2級では階層的クラスタリングとk-meansの基本概念が中心です。準1級では以下が加わります：

- 距離指標の種類（ユークリッド・マンハッタン・コサイン・マハラノビス）の使い分け
- Ward法の最小化基準（クラスター内分散の増加量）の数式理解
- k-meansのEM的収束アルゴリズムの理解
- エルボー法・シルエット係数によるクラスター数の決定
- DBSCAN・GMM など発展的なクラスタリング手法の概要
