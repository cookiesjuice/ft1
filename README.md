# FF14 仙人微彩小工具

Final Fantasy XIV Mini Cactpot Tools

一个简单的javascript工具，可以最大化仙人微彩的收入。

## 使用方法：

<https://cookiesjuice.github.io/ft1/>

在**计算**输入数字，点击**提交**，会用<span style="color: red;">红色</span>标记推荐点开的单元格，或者推荐选择的线

**模拟**则是模拟一个仙人微彩小游戏。

## 算法：

仙人微彩本身是一个Markov Decision Process。状态，动作，以及新状态的概率都非常容易计算，所以可以通过动态规划计算每个状态的最优动作。
