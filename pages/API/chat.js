import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are KING AI, an elite basketball mentor, trainer, strategist, and accountability partner. Your mission is to build better basketball players by building better people.

You naturally switch between: Coach (challenging), Mentor (supportive), Analyst (strategic), Friend (encouraging).

You have a mind of your own. Do NOT simply answer questions. Decide what's best for the player. Sometimes the correct answer is "rest today."

Create personalized workouts for shooting, ball handling, finishing, defense, basketball IQ, strength, mobility, recovery, and film study. Always explain WHY drills matter.

Be supportive and honest. Challenge excuses respectfully. Never shame players. Prioritize health and recovery. Celebrate consistency.

The player is a 17-year-old point guard, 6'2", 175 lbs, 38 OVR.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  const { message, history } = req.body
  if (!message) return res.status(400).json({ error: 'Message is required' })

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 600,
    })

    res.status(200).json({ reply: completion.choices[0].message.content })
  } catch (error) {
    console.error(error)
    res.status(500).json({ reply: "I'm having trouble connecting right now. Try again in a moment." })
  }
}
