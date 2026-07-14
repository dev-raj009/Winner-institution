// api/index.js - Optimized for Vercel Serverless
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ ALL CONFIGURATIONS IN CODE ============
const CONFIG = {
  BASE_URL: 'https://open-mora-natking151-ea9216fb.koyeb.app',
  TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjMxMjM0NTAiLCJ0aW1lc3RhbXAiOjE3ODQwNDE0ODMsIml2X3ZlciI6MSwic2Vzc2lvbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpwWkNJNklqTXhNak0wTlRBaUxDSmxiV0ZwYkNJNkltRjVkWE5vWW1KaWMybHVaMmd4TVRJeU9EQkFaMjFoYVd3dVkyOXRJaXdpYm1GdFpTSTZJa0Y1ZFhOb0lGTnBibWRvSUhKaGJtRWlMQ0owWlc1aGJuUlVlWEJsSWpvaWRYTmxjaUlzSW5SbGJtRnVkRTVoYldVaU9pSjNhVzV1WlhKemFXNXpkR2wwZFhSbFgyUmlJaXdpZEdWdVlXNTBTV1FpT2lJaUxDSmthWE53YjNOaFlteGxJanBtWVd4elpYMC52U1dRanl0ZHUyNGtLaXRoTmNFc1MweExVb19najE5d0kyWE1aZ0NrMTRVIn0._uSbBYaxyC4eAlUvkD4TnluXaJTIfUnTZ_iO3iXGdfY',
  USER_AGENT: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36',
  REFERER: 'https://studyking-snowy.vercel.app/#/student/edu-platform/winners/batches'
};

// Helper function to get headers
const getHeaders = (referer = CONFIG.REFERER) => ({
  'Authorization': CONFIG.TOKEN,
  'User-Agent': CONFIG.USER_AGENT,
  'Referer': referer,
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive'
});

// ============ ERROR HANDLING ============
const handleRequest = async (req, res, apiCall) => {
  try {
    const result = await apiCall();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Send appropriate error response
    const statusCode = error.response?.status || 500;
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error',
      details: error.response?.data || null,
      timestamp: new Date().toISOString()
    });
  }
};

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// ============ ROOT ENDPOINT ============
app.get('/', (req, res) => {
  res.json({
    name: 'StudyKing API Proxy',
    version: '2.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      batches: '/api/batches?start=0&limit=50',
      batch: '/api/batches/:batchId',
      subjects: '/api/batches/:batchId/subjects',
      topics: '/api/batches/:batchId/subjects/:subjectId/topics',
      contents: '/api/batches/:batchId/subjects/:subjectId/contents?tid=:topicId',
      video: '/api/video-details?vid=:videoId'
    },
    timestamp: new Date().toISOString()
  });
});

// ============ MAIN API ENDPOINTS ============

// 1. GET /api/batches
app.get('/api/batches', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { start = 0, limit = 50 } = req.query;
    const url = `${CONFIG.BASE_URL}/winners/batches?start=${start}&limit=${limit}`;
    const response = await axios.get(url, { 
      headers: getHeaders(),
      timeout: 30000
    });
    return response.data;
  });
});

// 2. GET /api/batches/:batchId
app.get('/api/batches/:batchId', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { batchId } = req.params;
    const url = `${CONFIG.BASE_URL}/winners/batches/${batchId}`;
    const response = await axios.get(url, { 
      headers: getHeaders(),
      timeout: 30000
    });
    return response.data;
  });
});

// 3. GET /api/batches/:batchId/subjects
app.get('/api/batches/:batchId/subjects', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { batchId } = req.params;
    const url = `${CONFIG.BASE_URL}/winners/batches/${batchId}/subjects`;
    const response = await axios.get(url, { 
      headers: getHeaders(),
      timeout: 30000
    });
    return response.data;
  });
});

// 4. GET /api/batches/:batchId/subjects/:subjectId/topics
app.get('/api/batches/:batchId/subjects/:subjectId/topics', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { batchId, subjectId } = req.params;
    const url = `${CONFIG.BASE_URL}/winners/batches/${batchId}/subjects/${subjectId}/topics`;
    const referer = `https://studyking-snowy.vercel.app/#/student/edu-platform/winners/${batchId}/s/${subjectId}`;
    const response = await axios.get(url, { 
      headers: getHeaders(referer),
      timeout: 30000
    });
    return response.data;
  });
});

// 5. GET /api/batches/:batchId/subjects/:subjectId/contents
app.get('/api/batches/:batchId/subjects/:subjectId/contents', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { batchId, subjectId } = req.params;
    const { tid } = req.query;
    
    if (!tid) {
      throw new Error('Topic ID (tid) is required');
    }
    
    const url = `${CONFIG.BASE_URL}/winners/batches/${batchId}/subjects/${subjectId}/contents?tid=${tid}`;
    const referer = `https://studyking-snowy.vercel.app/#/student/edu-platform/winners/${batchId}/s/${subjectId}/t/${tid}`;
    const response = await axios.get(url, { 
      headers: getHeaders(referer),
      timeout: 30000
    });
    return response.data;
  });
});

// 6. GET /api/video-details
app.get('/api/video-details', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { vid } = req.query;
    
    if (!vid) {
      throw new Error('Video ID (vid) is required');
    }
    
    const url = `${CONFIG.BASE_URL}/winners/video-details?vid=${vid}`;
    const response = await axios.get(url, { 
      headers: getHeaders(),
      timeout: 30000
    });
    return response.data;
  });
});

// 7. GET /api/batches/:batchId/subjects/:subjectId - Get subject details
app.get('/api/batches/:batchId/subjects/:subjectId', async (req, res) => {
  await handleRequest(req, res, async () => {
    const { batchId, subjectId } = req.params;
    const url = `${CONFIG.BASE_URL}/winners/batches/${batchId}/subjects/${subjectId}`;
    const response = await axios.get(url, { 
      headers: getHeaders(),
      timeout: 30000
    });
    return response.data;
  });
});

// ============ 404 Handler ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// ============ Global Error Handler ============
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// ============ Export for Vercel ============
module.exports = app;

// ============ Local Development ============
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('🚀 StudyKing API Proxy Server');
    console.log('===============================');
    console.log(`📍 Server running on: http://localhost:${PORT}`);
    console.log('\n📋 Available Endpoints:');
    console.log('  GET  /');
    console.log('  GET  /api/health');
    console.log('  GET  /api/batches?start=0&limit=50');
    console.log('  GET  /api/batches/:batchId');
    console.log('  GET  /api/batches/:batchId/subjects');
    console.log('  GET  /api/batches/:batchId/subjects/:subjectId/topics');
    console.log('  GET  /api/batches/:batchId/subjects/:subjectId/contents?tid=123');
    console.log('  GET  /api/video-details?vid=123');
    console.log('===============================');
  });
}
