ウーバーイーツのようなアプリケーションを作るプロジェクト

# 要件定義・設計

## 実装する機能、および画面遷移の流れ
<img src="https://user-images.githubusercontent.com/71915489/145073423-5a22f574-a8cf-453d-bfaf-5d65811ae896.png" width="400">


### 店舗一覧画面
トップページには店舗一覧がある。この中から１つの店舗をクリックすると、その店舗が持っている商品一覧ページへと遷移。

### 商品一覧画面
商品一覧画面の中にはまず、商品が一覧で並んでいる。その中の１つ、ハンバーガーをクリックするとまず仮注文のモーダルが表示される。

### 仮注文
このときその数量を選択できるようにすることを忘れない。そうしないと、ハンバーガーを３つ頼みたい時に、３回クリックするという面倒なUX(ユーザー体験)になってしまう。

つまり、仮注文モーダルの中では特定の商品をいくつ頼むか？ということを選択できるようにするUI(ユーザーインターフェース)が必要。

### 注文画面
最後に、仮注文が確定したらそれらをまとめて確認し、また問題なければそのまま注文確定することができる画面を用意。もし仮注文が複数(上記の図でいえばハンバーガーとポテトが１つずつ)あるような場合には、それらの合計価格とさらに店舗の配送手数料が加算されます。そして最終的な注文内容に誤りがなければ、注文確定をするという流れになる。

##  例外パターンの考慮
<img src="https://user-images.githubusercontent.com/71915489/145073967-36bbf6e3-fae5-4a59-a4c1-c7c3f6914778.png" width="400">

店舗Aで仮注文を行ったあとも、店舗一覧画面に遷移することは可能である。そしてその中で店舗Bを選択し、店舗Bの商品一覧を選ぶこともできる。その場合に、店舗Aの商品の仮注文と店舗Bのそれが併存することを許容するかどうか？はとくにサーバーサイドの処理のなかでとても重要なビジネスロジックの一つになる。

### Uber eatsではどうか？
ここでは店舗Aで仮注文がある状態で、別の店舗Bでさらに仮注文をしようとすると新規注文のモーダルが表示された。つまり、仮注文は同時に１つの店舗しか存在しえないという仕様のようである。

ここで、「新規注文」ボタンを押すと、店舗Aの仮注文は削除され、店舗Bで仮注文した内容が注文画面に表示されました。

本プロジェクトでもこの仕様を踏襲し、仮注文をPOSTする際には、別店舗の仮注文がないか？をチェックしたうえでAPIの挙動を変えるようにする。

## 実装する範囲・要件

今回はあくまでRailsとReactを使ったSPAの開発が目的のため、以下を前提として実装範囲を決める。

* 複雑なサーバーサイドの処理は書かない
* モデルの定義は最低限の動きにのみ対応する
* ページ遷移は全てReact Routerをつかったルーティング
* RailsではViewを用意せず、React側で画面を作っていく
* Reactの例外処理は最低限

### 実装の大まかな流れ

今回はサーバーサイドから実装していく。つまり、Ruby on Rails側から作っていく。しかもAPIコントローラーを１つ作って画面を作って、とサーバー・フロントを行き来しない。サーバーサイドを全て作り終えてから、フロントエンドに移る。途中でコントローラーの確認は挟む。

こうすることでRailsとReactで頭の使い方をいちいち切り替えなくて良い。

### 実装するもの

**サーバーサイド**

* 最低限の動きに必要なデータのMigrationとModelの定義
* データを取得するためのAPI Controllerの実装
* APIのなかで例外パターンに一致する場合にはエラーを返却すること
* サーバーサイドはこれらがあれば、データを用意し、それを返却するだけというシンプルなAPIサーバーをつくることができます。もちろん後から複雑なロジックを追加することもできますし、別のデータが必要になった場合にも同様に拡充することができます。

**フロントエンド**

* ルーティング(画面遷移)はReactで行う
* レイアウトはなるべくUber eatsぽくするものの、細かい部分は省略する

本家Uber eatsとまったく同じレイアウトを目指すとCSSや画像などが大量に必要になる。今回はあくまでSPAの開発が主目的なので、最低限のレイアウトのみに留める。

### 実装しないもの

サーバーサイド

* データを投入するAdmin画面(システム管理者用画面)
* データごとのユニークな画像
* テスト
* ユーザー登録/ログインの処理
* 本番デプロイ

今回はローカル開発環境でのみ動くものを目指す。本番にデプロイして動かすこともできるが、その場合に考慮しなければいけないことがたくさんあるため、実装スコープからは除外。

さらに、商品データ１つ１つにユニークな画像(商品Aは画像A、商品Bは画像B...)を用意せず、フロントエンドで共通の画像を表示させるようにする。プロジェクトとしてユニークな画像を用意しない、というだけでありUIを拡張するなかで商品ごとの画像を表示させるということも十分に可能。

フロントエンド

* エラーの場合の例外処理
* テスト
* HTML/CSS

SPAの場合、データはおもにAPIから非同期で取得。つまり、画面表示時には問題ないのに、あとからAPI側でデータが不整合だったり、リクエストに失敗することでエラーになるというケースである。この場合にReact側ではエラー文章を画面に表示したり、画面遷移をさせたりアウルが、今回はそうしたエッジケース(例外処理)は考慮しない。

## 実装の順番

アプリケーションの要件は決まったので次に、実装の手順を確認する。

今回はサーバーサイド/フロントエンドの２つをそれぞれ実装するが、その順番としては、まず初めにサーバーサイドを全て実装し、その後フロントエンド、という順番で進める。

なぜこの順番で作るか、というとサーバー/フロントのスイッチングコスト(作業切替にかかる手間)を省くためである。例えば、１ページごとにサーバー/フロントを一緒に作るという方法もあるが、そうすると都度作業プロジェクトを切り替える必要がでてくる。

また、ページごとに個別最適なコードになりがちで、コード全体の設計が"がたつく"ことがある。

ということで、今回はサーバーサイド単体をまずは完成させて、その後それに沿ってフロントの実装を進めていくことにする。

## データ・モデルの設計

### 基本的なデータ

**店舗の情報**

* 店舗のID
* 店舗名
* 配送手数料
* 配送にかかる時間

**商品の情報**

* 商品名
* 商品価格
* 商品の説明文章

店舗１つにつき複数の商品データが紐づく1:n の関係。

### 注文に関するデータ
続いて、店舗や商品などの目に見えるもの以外で必要なデータを定義する。ここでは、仮注文データと注文データの２つである。ここで図解をみてみる。

<img src="https://user-images.githubusercontent.com/71915489/145074283-3eb18de4-6662-4681-a15d-7a3ada260f19.png" width="400">

仮注文データはあくまで商品と1:1の関係にあり、その商品がいくつか？という情報しか持たない。一方、注文データは商品の個数は気にせず、紐づく仮注文の合計情報だけを保持する。ここで仮注文データと注文データはn:1の関係とする。

**仮注文の情報**

* 店舗ID
* 商品ID
* 商品の個数
* active/not activeの状態
* 注文ID

仮注文データは頻繁に作成されたり、消されたり、また注文が確定するとDisabledになるようにする。そのため、**物理削除ではなく、論理削除できるようにactiveかどうか？というboolean型のフラグをもたせる。**

こうすることで、本注文後に仮注文はすでに役目を終えたとしても、注文データから仮注文データを参照することができるようになる。

> 一般的にデータベースに作成されたレコードは論理削除(booleanなどで活性 -> 非活性に変更すること)できる設計が多い。例えばSNSのユーザーデータなどを考えても、退会したら削除するのではなく、論理削除できるようにすることで、退会したユーザーがどんな情報を持っていたか？を追えるようになる。

**注文の情報**

* 店舗ID
* 合計金額

注文自体はどの店舗に対して、いくらの金額を払うか？ということのみを保持するようにする。

## フロントエンドの設計

続いては決まったデータをもとに、画面とコンポーネントの設計をしていく。特に画面に対応するコンポーネントはデータを扱うことから、最初の設計を誤ると保守性の低いフロントエンドのコードになってしまう。

ちなみに、ここでいうコンポーネントとはUI(ユーザーインターフェース)のパーツ・部品のようなもので、ボタンや画像などもコンポーネントの一部である。このようなコンポーネントを幾重にも重ねて複雑なページを構成していく。

### Container / Presentational Component について

まず初めに主にReactでよく推奨されるコンポーネントの種類分けについて。
まず１つ目が「データを扱うコンポーネント」であるContainer Componentというもの。
**Container Component**はデータをもち、また親コンポーネントとして複数の子コンポーネントにデータを渡す役割を担当。

一方、「受け取ったデータをただ表示するだけ」のPresentational Componentには例えばボタンやモーダルなどが含まれる。

ではなぜこの２種類に分けるべきなのか？いくつかメリットが挙げられるが、一番大きいのは子コンポーネントの再利用性を高めるということである。Presentational Componentは子コンポーネントとしてUIを提供することだけに関心を持つ。そのため、どのようなデータが入ってくるか？によってその振る舞いを変えることができる。

もし子コンポーネントにデータを持たせてしまうと、複数ページで同じようなUIなのにデータが異なるという場合に再利用できず、結局コピペするということになってしまう。これが局所的なら問題ないが、ボタンやモーダルなど頻繁に利用されるものであれば尚更データを持たせるべきではない。

**本教材のコンポーネント設計**

小さめのアプリケーションであれば分ける必要もなかったりするが、今回は練習として明示的にContainer層/Component層をディレクトリから分けていく。また、１ページに１Containerとして以下のようなContainerを作成。

* `containers/Restaurants.jsx`
* `containers/Foods.jsx`
* `containers/Orders.jsx`

これらは各ページの最も上部に存在するContainer層で、データを扱う。
これらの中にボタンや画像など子コンポーネントがレイアウトのみを提供する。その子コンポーネントは以下のディレクトリに置いていく。

* `components/Buttons/HogeButton.jsx`
* `components/Modals/FugaModal.jsx`
* `components/Wrapper.jsx`

ボタンやモーダルなど複数種類存在し得るものについてはcomponents/Buttonsと１つ階層を掘っていくことで、コンポーネントを管理しやすくする。

## APIを呼ぶ関数

続いて、フロントエンドからAPIを叩く部分を考える。一般的にファイルごとに関心は分離すべきです。そのため、Reactのコンポーネントはあくまでレイアウトやデータを保持することにする。その場合に、各種APIを呼ぶ部分は関数化して他のファイルに分けることで関心を分離することができます。

コンポーネントファイルの中にAPIを叩く関数を定義してしまうと、例えば他のページから同じAPIを叩きたいという場合に参照できずに、これもまたコピペする羽目になってしまう。それを避けるためにコンポーネントファイル/API関数ファイルを分ける。

このようなディレクトリで定義。

* `apis/restaurants.js`
* `apis/foods.js`
* `apis/orders.js`
