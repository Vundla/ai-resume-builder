async function generateResume(userInput, templateId) {
  const response = await fetch('/api/generate-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInput, templateId }),
  });
  if (!response.ok) throw new Error('Failed to generate resume');
  return response.json();
}
