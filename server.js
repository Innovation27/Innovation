const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ALIYUN_API_KEY;

// 如果环境变量不存在，给出明确的错误
if (!API_KEY) {
  console.error("错误: 缺少ALIYUN_API_KEY环境变量");
  process.exit(1);
}

const BASE_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // 打印接收到的请求内容
    console.log("Received request:", messages);

    const response = await axios.post(
      BASE_URL,
      {
        model: "qwen-max",
        messages: messages,
        max_tokens: 70,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 打印API响应
    console.log("API Response:", response.data);

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    // 详细的错误日志
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ error: "服务器错误" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
