import Groq from "groq-sdk";

import dotenv from 'dotenv'
dotenv.config();


const llm = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function suggestTasks(req, res) {
  try {
    const { title, description } = req.body;
    const completion = await llm.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            `You are a helpful concise assistant that suggests related tasks based on user input.
            Respond with a "tasks" JSON object containing three items with title and description properties.`,
        },
        {
          role: "user",
          content: `Suggest related tasks for: ${title}, ${description}`,
        },
      ],
      response_format: {type: "json_object"}
    });

    const { tasks: suggestions} = JSON.parse(
      completion.choices[0]?.message?.content || "[]"
    );
    res.json(suggestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
}


export default {
    suggestTasks,
}