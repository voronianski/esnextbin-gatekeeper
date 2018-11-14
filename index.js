const micro = require('micro');
const cors = require('micro-cors')();
const { router, get } = require('microrouter');
const request = require('superagent');

const PORT = process.env.PORT || 9393;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const { send } = micro;

const ping = (req, res) => 'pong ^.^';
const token = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return send(res, 400, {error: 'code is missing'});
  }

  try {
    const githubRes = await request
      .post('https://github.com/login/oauth/access_token')
      .send({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code
      });

    send(res, 200, {token: githubRes.body.access_token});
  } catch (err) {
    send(res, 500, {error: 'github login failed'});
  }
};

const routes = router(
  get('/ping', ping),
  get('/token', token)
);
const server = micro(cors(routes));

server.listen(PORT, () => {
  console.log(`esnextb.in-gatekeeper started on http://localhost:${PORT}`);
});
