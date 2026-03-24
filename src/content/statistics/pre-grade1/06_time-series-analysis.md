---
title: "時系列分析"
grade: "pre-grade1"
topic_id: "06_time-series-analysis"
order: 6
---

## 時系列データの構成要素

時間軸に沿って観測された数値データを**時系列データ**といいます。株価・気温・販売数量など現実の多くのデータが時系列として表されます。時系列データは以下の成分に分解して理解するのが基本です：

- **トレンド（長期趨勢）**：長期的な増加・減少傾向
- **季節性（周期変動）**：年・月・週などの規則的な周期変動
- **循環変動**：景気サイクルのような数年単位の変動
- **不規則変動（残差）**：上記以外の不規則なランダム成分

$$Y_t = T_t + S_t + C_t + I_t \quad \text{（加法モデル）}$$

乗法モデル（$Y_t = T_t \times S_t \times C_t \times I_t$）は、季節変動の振れ幅がトレンドに比例して拡大する場合に使います。

## 定常性の概念

時系列分析の多くのモデルは**定常性**（stationarity）を前提とします。弱定常性（Wide-Sense Stationarity）の条件は：

1. 平均が時間に依存しない：$E[Y_t] = \mu$（定数）
2. 分散が時間に依存しない：$\text{Var}(Y_t) = \sigma^2$（定数）
3. 自己共分散が時間差 $h$ のみに依存する：$\text{Cov}(Y_t, Y_{t+h}) = \gamma(h)$

トレンドや季節性があると定常でなくなります。差分変換（$\Delta Y_t = Y_t - Y_{t-1}$）や対数変換によって定常化を図るのが一般的な前処理です。

## 定常性の検定（ADF検定）

目視でトレンドがあるかを判断するのは主観的です。**単位根検定**（Augmented Dickey-Fuller検定：ADF検定）は、系列に単位根（非定常性の一種）があるかを統計的に検定します。

- **帰無仮説 $H_0$**：単位根がある（非定常）
- **対立仮説 $H_1$**：単位根がない（定常）

p値が有意水準（0.05など）より小さければ帰無仮説を棄却し「定常」と判断します。

```python
from statsmodels.tsa.stattools import adfuller
import pandas as pd

# ADF検定の実施
result = adfuller(y_series, autolag='AIC')
print(f'ADF統計量: {result[0]:.4f}')
print(f'p値: {result[1]:.4f}')
print('棄却域（1%/5%/10%）:', result[4])

# p値 > 0.05 なら非定常 → 差分をとる
if result[1] > 0.05:
    y_diff = y_series.diff().dropna()
    result2 = adfuller(y_diff, autolag='AIC')
    print(f'\n1階差分後のp値: {result2[1]:.4f}')
```

## 差分をとって定常化する操作の意味

**1階差分**（$\Delta Y_t = Y_t - Y_{t-1}$）はトレンドを除去し、「前期から今期への変化量」に変換します。株価そのものは非定常（上昇トレンドがある）でも、日次リターン（前日比変化率）は定常に近くなります。

**対数差分**（$\Delta \ln Y_t = \ln Y_t - \ln Y_{t-1}$）は変化率（約：成長率）を表し、分散安定化の効果もあります。

注意：**過剰差分（overdifferencing）**は避けてください。本来定常な系列に差分をとると、移動平均成分が人工的に生まれてモデルが複雑になります。ADF検定で $d$ を慎重に決めることが重要です。

## 自己相関関数（ACF）とコレログラム

時系列 $\{Y_t\}$ の時間差 $h$ における**自己相関関数（ACF）**は：

$$\rho(h) = \frac{\gamma(h)}{\gamma(0)} = \frac{\text{Cov}(Y_t, Y_{t+h})}{\text{Var}(Y_t)}$$

各ラグ $h$ に対して $\hat{\rho}(h)$ をプロットしたものが**コレログラム**（ACFプロット）です。青い影の範囲（95%信頼区間：$\pm 1.96/\sqrt{n}$）を超えるラグで自己相関が有意です。

## 偏自己相関関数（PACF）

**偏自己相関関数（PACF）**は、$Y_{t-1}, \ldots, Y_{t-h+1}$ の影響を取り除いた上での $Y_t$ と $Y_{t-h}$ の相関です。ACF・PACF のパターンからモデルを識別します：

| モデル | ACF | PACF |
|--------|-----|------|
| AR($p$) | 緩やかに減衰 | ラグ $p$ で急激に打ち切れ |
| MA($q$) | ラグ $q$ で急激に打ち切れ | 緩やかに減衰 |
| ARMA($p$,$q$) | 緩やかに減衰 | 緩やかに減衰 |

## AR・MA・ARMA モデル

**AR（自己回帰）モデル** AR($p$)：過去 $p$ 期の値の線形結合で現在値を表します：

$$Y_t = \phi_1 Y_{t-1} + \cdots + \phi_p Y_{t-p} + \varepsilon_t$$

**MA（移動平均）モデル** MA($q$)：過去 $q$ 期のホワイトノイズの線形結合です：

$$Y_t = \varepsilon_t + \theta_1 \varepsilon_{t-1} + \cdots + \theta_q \varepsilon_{t-q}$$

「移動平均」という名前ですが、データの平均ではなく「過去の予測誤差（残差）の加重和」であることに注意してください。

**ARMA($p$,$q$)**：AR と MA を組み合わせたモデルです。

## ARIMAモデルとパラメータの決め方

非定常時系列に対し $d$ 回の差分をとって定常化してから ARMA モデルを当てはめる手法が **ARIMA($p$,$d$,$q$)** です。

### パラメータ $(p, d, q)$ の決め方

1. **$d$（差分次数）の決定**：ADF検定で単位根の有無を確認。1回差分で定常になれば $d=1$。
2. **$p$（AR次数）の決定**：差分後の系列のPACFを見て、打ち切れるラグの数を $p$ とする。
3. **$q$（MA次数）の決定**：差分後の系列のACFを見て、打ち切れるラグの数を $q$ とする。

最終的にはAIC・BICを用いて複数の候補を比較し、最適なモデルを選びます。

```python
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt

# ACF・PACFプロット（p,qの決定に使用）
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 6))
plot_acf(y_diff, lags=20, ax=ax1, title='ACF（MA次数qの決定）')
plot_pacf(y_diff, lags=20, ax=ax2, title='PACF（AR次数pの決定）')
plt.tight_layout()
plt.show()

# ARIMAモデルの推定
model = ARIMA(y_train, order=(1, 1, 1))  # (p, d, q)
result = model.fit()
print(result.summary())  # AIC・係数・p値を確認

# 予測
forecast = result.forecast(steps=12)
print("12期先の予測値:", forecast)
```

## 季節調整済み系列の作り方

季節性があるデータは、まず季節成分を除去してからモデル化します。季節調整の主な方法：

1. **季節差分**：$\Delta_s Y_t = Y_t - Y_{t-s}$（例：月次データで $s=12$）
2. **X-13ARIMA-SEATS**：米国センサス局が開発した統計的季節調整プログラム
3. **STL（Seasonal and Trend decomposition using Loess）**：頑健な季節分解

```python
from statsmodels.tsa.seasonal import seasonal_decompose

# 加法モデルで季節分解
decomp = seasonal_decompose(y_series, model='additive', period=12)
seasonal_adj = y_series - decomp.seasonal  # 季節調整済み系列

decomp.plot()
plt.show()
```

## 適用の前提条件

1. **等間隔の観測**：データが等間隔で観測されていること（欠損値は補完が必要）
2. **定常性**：ARMAモデルを適用する前に定常性を確認・確保する
3. **十分なサンプルサイズ**：ARIMAの場合、一般に50期以上が推奨

## 実務での落とし穴

- **差分をとれば必ず定常化できると思いがちですが**、過剰差分はMA成分を人工的に生み出します。ADF検定で $d$ を慎重に選んでください。
- **予測区間の拡大**：多期先予測では予測区間が急速に広がります。ARIMA は短期予測には有効ですが、長期予測への過信は禁物です。
- **残差診断を怠らない**：モデル推定後は残差の自己相関（Ljung-Box検定）と正規性を確認してください。

## 2級との違い・発展内容

統計検定2級では時系列の基本概念（トレンド・季節性）が中心です。準1級では以下が加わります：

- 定常性の数学的定義とADF検定の実施
- ACF・PACFパターンからのAR/MA次数の読み取り
- ARIMAモデルの $(p,d,q)$ の選択手順
- 季節ARIMAモデル（SARIMA）の概念
- 予測精度の評価指標（RMSE・MAE・MAPE）
