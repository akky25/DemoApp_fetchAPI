async function main() {
  try {
    const userId = document.getElementById("userId").value;
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch (response) {
    if (response.status == '404') {
      displayView('ユーザーが見つかりません')
    }
    console.log(`${response.status}: ${response.statusText}`);
  }
}

/**
 * GitHubからユーザー情報を取得
 * @param {String} userId ユーザid
 */
function fetchUserInfo(userId) {
  // fetchAPIはPromiseオブジェクトを返却する
  // 取得が成功した場合、このPromiseインスタンスはHTTPレスポンスをResponseオブジェクトとしてresolveする
  // HTTP通信エラーの場合は、エラー情報を含むPromiseオブジェクトをreturnする
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
    .then(response => {
      // ResponseのstatusプロパティからHTTPレスポンスのステータスコードが取得可能
      console.log(response.status);
      // HTTPステータスのハンドリング
      if (!response.ok) {
        return Promise.reject(response);
        // ステータスエラーの場合、エラー情報を含むPromiseをreturnする
        // return Promise.reject(new Error(`${response.status}: ${response.statusText}`));
      } else {
        // ステータスがOKの場合、レスポンスボディを含むPromiseをreturnする
        // Responseオブジェクトのjson()はPromiseをreturnする
        // このPromiseはHTTPレスポンスボディをjsonとしてパースしたオブジェクトでresoleveする
        return response.json()
      }
    });
}

/**
 * ユーザー情報からHTMLを生成する
 * @param {object} userInfo 
 */
function createView(userInfo) {
  return escapeHTML`
  <h4>${userInfo.name} (@${userInfo.login})</h4>
  <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
  <dl>
      <dt>Location</dt>
      <dd>${userInfo.location}</dd>
      <dt>Repositories</dt>
      <dd>${userInfo.public_repos}</dd>
  </dl>
  `;
}

/**
 * HTMLを表示する 
 * @param {string} view 
 */
function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
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
 * @param {object} strings 
 * @param  {object} values 
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