// pages/api/[...path].js
import { useRouter } from 'next/router';

export default function handler(req, res) {
  const router = useRouter();
  const { path } = router.query;

  // เส้นทาง API และไฟล์ที่เกี่ยวข้องกับเส้นทางนั้น
  const routes = {
    'auth/[...nextauth]': 'auth/[...nextauth]',
    'auth/register': 'auth/register',
    'Search/[CA]': 'Search/[CA]',
    'Search/map': 'Search/map',
    'Search/STATUS': 'Search/STATUS',
    'addCharger': 'addCharger',
    'checkstatus': 'checkstatus',
    'deleteCharger': 'deleteCharger',
    'getCharger': 'getCharger',
    'login': 'login',
    'updateCharger': 'updateCharger',
    'updateHB': 'updateHB',
    'UpdateStatus': 'UpdateStatus',
  };

  const apiPath = routes[path.join('/')];

  if (apiPath) {
    // นำเส้นทาง API ไปยังไฟล์ API ที่เกี่ยวข้อง
    router.push(`/api/${apiPath}`);
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
}
