/**
 * This function is the entry point for the gluestack app.invoke.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 * @returns {Promise<import('express').Response>}
 */
const { DaprClient, HttpMethod } = require('@dapr/dapr');

module.exports = async (req, res) => {
  const { headers, body } = req;
  if (headers["content-length"]) delete headers["content-length"];

  if (!body.hasOwnProperty('action_name')) {
    return res.json({ status: false, message: 'Missing "action_name"' });
  }

  const daprHost = '127.0.0.1';
  const daprPort = 3500;

  const client = new DaprClient(daprHost, daprPort);

  let data = undefined;
  const appId = body.action_name;
  const options = { headers: { ...headers, "X-Glue-Invoke": "server" } };
  const methodName = body.hasOwnProperty('method_uri') ? body.method_uri : 'functions';
  const method = body.hasOwnProperty('method_name') ? body.method_name.toUpperCase() : HttpMethod.POST;

  if (method !== 'GET') {
    data = body.hasOwnProperty('data') ? { ...body.data } : {};
  }

  try {
    console.log(`invoking ${appId}::${methodName}`);
    
    const resp = await client.invoker.invoke(
      appId,
      methodName,
      method,
      data,
      options
    );

    return res.status(200).json({
      status: true,
      message: 'OK',
      data: resp
    });
  } catch (err) {
    console.log(`Error invoking ${appId}::${methodName}: ${err}`);

    return res.status(500).json({
      status: false,
      errors: err.message || err
    });
  }
};
