const axios = require('axios');
const fs = require('fs');

const proxies = [];
const output_file = 'proxy.txt';

if (fs.existsSync(output_file)) {
  fs.unlinkSync(output_file);
  console.log(`'${output_file}' đã xóa bỏ.`);
}

const raw_proxy_sites = [ 
  'http://worm.rip/http.txt',
  'http://worm.rip/socks5.txt',
  'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=all&timeout=10000&country=all&ssl=all&anonymity=all', 
  'https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies', 
  'https://api.openproxylist.xyz/http.txt', 
  'https://proxyspace.pro/http.txt', 
  'https://proxyspace.pro/https.txt', 
  'https://spys.me/proxy.txt', 
  'https://spys.me/socks.txt',
  'https://raw.githubusercontent.com/elliottophellia/yakumo/master/results/http/global/http_checked.txt',
  'https://proxydb.net/?country=VN',
  "https://daudau.org/api/http.txt",
  'https://www.proxy-list.download/api/v1/get?type=http',
  'https://www.proxy-list.download/api/v1/get?type=https',
];

async function fetchProxies() {
  // Thiết lập headers cho các yêu cầu
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept': 'text/plain, */*; q=0.01',
    'Accept-language': 'en-US;q=0.9,en;q=0.8',
    "method": "GET",
    "referrer": "https://google.com/"
  };

  for (const site of raw_proxy_sites) {
    try {
      // Thêm headers vào yêu cầu axios
      const response = await axios.get(site, { headers });
      const lines = response.data.split('\n');
      for (const line of lines) {
        if (line.includes(':')) {
          const [ip, port] = line.split(':', 2);
          proxies.push(`${ip}:${port}`);
        }
      }
    } catch (error) {
      console.error(`Không thể truy xuất proxy từ ${site}: ${error.message}`);
    }
  }

  fs.writeFileSync(output_file, proxies.join('\n'));
  console.log(`Proxy đã được truy xuất và lưu trữ thành công trong ${output_file}`);
}

fetchProxies();
