// const userId = "js-primer-example";

/**
 * GitHubからユーザー情報を取得
 * @param {String} userId ユーザid
 */
function fetchUserInfo(userId) {
  // fetchAPIはPromiseオブジェクトを返却する
  // このPromiseインスタンスはHTTPレスポンスをResponseオブジェクトとしてresolveする
  // HTTP通信エラーの場合は、エラー情報を含むオブジェクトでrejectされる
  fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      // ResponseのstatusプロパティからHTTPレスポンスのステータスコードが取得可能
      console.log(response.status);

      // HTTPステータスのハンドリング
      if (!response.ok) {
        console.error("エラーレスポンス", response);
      } else {
        // Responseオブジェクトのjson()はPromiseを返す
        // このPromiseはHTTPレスポンスボディをjsonとしてパースしたオブジェクトでresoleveする
        return response.json().then(userInfo => {
          // タグ関数によるHTMLの組み立て
          const view = escapeHTML`
          <h4>${userInfo.name} (@${userInfo.login})</h4>
          <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
          <dl>
              <dt>Location</dt>
              <dd>${userInfo.location}</dd>
              <dt>Repositories</dt>
              <dd>${userInfo.public_repos}</dd>
          </dl>
          `;
          // HTMLの挿入
          const result = document.getElementById("result");
          result.innerHTML = view;
        })
      }
    }).catch(error => {
      console.error(error);
    })
}

/**
 * エスケープ処理
 * @param {String} str 
 */
function escapeSpecialChars(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * テンプレートリテラルに対してエスケープ処理を行う
 * @param {*} strings 
 * @param  {...any} values 
 */
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === "string") {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
}