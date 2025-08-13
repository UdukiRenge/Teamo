import { Helmet } from "react-helmet-async";

const Meta = () => {
  return (
    <>
      <Helmet>
        <title>Teamo - ブラウザで簡単にメモ保存</title>
        <meta
          name="description"
          content="ブラウザで動くシンプルなメモアプリ。入力内容を保存・ダウンロードできます。"
        />
        <meta property="og:title" content="メモアプリ" />
        <meta
          property="og:description"
          content="ブラウザで動くシンプルなメモアプリ"
        />
        <meta
          property="og:image"
          content="https://teamo-uduki-renges-projects.vercel.app/TeamoTop.png"
        />
        <meta property="og:type" content="website" />
      </Helmet>
    </>
  );
}

export default Meta;