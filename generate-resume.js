app.post('/api/generate-resume', async (req, res) => {
  const { userInput, templateId } = req.body;
  try {
    // Construct prompt (example simplified)
    const prompt = `
      Create a professional resume based on this data:
      ${JSON.stringify(userInput)}
      Use template: ${templateId}
      Format response as JSON.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a resume generator.' },
        { role: 'user', content: prompt }
      ]
    });

    const response = completion.choices[0].message.content;

    // Convert JSON string to object (handle errors if JSON invalid)
    let resumeJSON;
    try {
      resumeJSON = JSON.parse(response);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON response from OpenAI' });
    }

    res.json(resumeJSON);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});
