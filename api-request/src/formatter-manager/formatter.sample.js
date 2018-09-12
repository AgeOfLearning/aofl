/**
 *
 */
class SampleFormatter {
  /**
   * @param {Object} payload
   * @return {Object}
   */
  static pack(payload) {
    let headers = new Headers();
    let boundary = 'Boundary-' + Date.now();
    let args = JSON.stringify(payload.args);

    let body = `--${boundary}
Content-Disposition: form-data; name="arguments"

${args}
--${boundary}--
`;

    headers.append('Accept', '*/*');
    headers.append('Content-Type', 'multipart/form-data; boundary=' + boundary);
    return {
      method: 'POST',
      headers,
      body,
      mode: 'cors',
      credentails: 'include'
    };
  }

  /**
   *
   * @param {Object} response
   * @return {Object}
   */
  static unpack(response) {
    return response.json();
  }
}

export default SampleFormatter;
