import requests
from typing import Optional
from backend.config import settings

class AIService:
    def __init__(self):
        self.provider = settings.ai_provider
        self.client = None
        self.ollama_available = False
        try:
            self._init_client()
        except Exception as e:
            print(f"Warning: Could not initialize AI client: {e}")
            self.client = None
    
    def _init_client(self):
        if self.provider == "openai":
            if not settings.openai_api_key or settings.openai_api_key == "your_openai_api_key_here":
                print("Warning: OPENAI_API_KEY not configured. AI features will be limited.")
                return
            # OpenAI client initialization
            try:
                from openai import OpenAI
                self.client = OpenAI(
                    api_key=settings.openai_api_key,
                    base_url=settings.openai_base_url
                )
            except ImportError:
                print("Warning: OpenAI library not installed")
        elif self.provider == "ollama":
            # Check if Ollama is available
            try:
                response = requests.get(f"{settings.ollama_base_url}/api/tags", timeout=10)
                if response.status_code == 200:
                    self.ollama_available = True
                    print(f"Ollama connected successfully at {settings.ollama_base_url}")
                else:
                    print(f"Warning: Ollama returned status {response.status_code}")
            except Exception as e:
                print(f"Warning: Could not connect to Ollama: {e}")
    
    async def chat(self, message: str, conversation_history: list = None) -> str:
        try:
            if self.provider == "ollama":
                if not self.ollama_available:
                    return "Ollama is not available. Please make sure Ollama is running."
                
                # Build messages for Ollama
                messages = []
                messages.append({
                    "role": "system",
                    "content": """You are an intelligent exam-solving assistant.

IMPORTANT KNOWLEDGE LIMITATION:
- Your knowledge has a cutoff date and may not include very recent events, current office holders, or real-time information.
- For questions about current affairs, recent appointments, or time-sensitive topics, always state that your information may not be up-to-date.
- If asked about current political figures, recent news, or events after your knowledge cutoff, clearly mention this limitation.

CORE RULES:
1. Analyze the user's question carefully before answering.
2. If the question contains an incorrect option, typo, missing value, formatting error, or inconsistent information:
   - Detect the problem.
   - Clearly identify what is incorrect or missing.
   - Infer the most reasonable intended meaning when possible.
   - Do NOT blindly accept incorrect information.
3. If enough information exists, solve the problem yourself.
4. Give the final answer even when the question has minor errors.
5. For mathematical/technical questions:
   - Show the formula.
   - Substitute values.
   - Calculate step-by-step.
   - Give the final answer clearly.
6. If multiple interpretations are possible, explain the most likely interpretation first and briefly mention the alternative.
7. For MCQs:
   - Identify the correct option.
   - Explain why it is correct.
   - Briefly explain why the other options are incorrect when useful.
8. If the user uploads an image, read the question from the image and solve it.
9. Never say "I cannot understand" if the question can reasonably be reconstructed.
10. If the image/text is unclear, state exactly which part is unclear and solve the readable part.
11. Keep answers concise unless the user asks for detailed explanation.
12. Prioritize correctness, speed, and clear explanations.
13. Never invent missing numerical values. If a value is genuinely required, ask for it.
14. Always end numerical problems with:
   FINAL ANSWER: <answer>

RESPONSE STYLE:
- Easy language
- Short paragraphs
- Step-by-step when needed
- No unnecessary repetition
- Highlight important formulas and final answers"""
                })
                
                # Add conversation history
                if conversation_history:
                    for conv in conversation_history[-10:]:
                        messages.append({"role": "user", "content": conv.user_message})
                        messages.append({"role": "assistant", "content": conv.ai_response})
                
                # Add current message
                messages.append({"role": "user", "content": message})
                
                # Call Ollama API
                response = requests.post(
                    f"{settings.ollama_base_url}/api/chat",
                    json={
                        "model": settings.ollama_model,
                        "messages": messages,
                        "stream": False
                    },
                    timeout=30
                )
                
                if response.status_code == 200:
                    return response.json().get("message", {}).get("content", "No response from Ollama")
                else:
                    return f"Error: Ollama returned status {response.status_code}"
            
            elif self.provider == "openai":
                if not self.client:
                    return "OpenAI client not initialized. Please configure your API key in the .env file."
                
                # OpenAI implementation
                messages = []
                messages.append({
                    "role": "system",
                    "content": """You are an intelligent exam-solving assistant.

IMPORTANT KNOWLEDGE LIMITATION:
- Your knowledge has a cutoff date and may not include very recent events, current office holders, or real-time information.
- For questions about current affairs, recent appointments, or time-sensitive topics, always state that your information may not be up-to-date.
- If asked about current political figures, recent news, or events after your knowledge cutoff, clearly mention this limitation.

CORE RULES:
1. Analyze the user's question carefully before answering.
2. If the question contains an incorrect option, typo, missing value, formatting error, or inconsistent information:
   - Detect the problem.
   - Clearly identify what is incorrect or missing.
   - Infer the most reasonable intended meaning when possible.
   - Do NOT blindly accept incorrect information.
3. If enough information exists, solve the problem yourself.
4. Give the final answer even when the question has minor errors.
5. For mathematical/technical questions:
   - Show the formula.
   - Substitute values.
   - Calculate step-by-step.
   - Give the final answer clearly.
6. If multiple interpretations are possible, explain the most likely interpretation first and briefly mention the alternative.
7. For MCQs:
   - Identify the correct option.
   - Explain why it is correct.
   - Briefly explain why the other options are incorrect when useful.
8. If the user uploads an image, read the question from the image and solve it.
9. Never say "I cannot understand" if the question can reasonably be reconstructed.
10. If the image/text is unclear, state exactly which part is unclear and solve the readable part.
11. Keep answers concise unless the user asks for detailed explanation.
12. Prioritize correctness, speed, and clear explanations.
13. Never invent missing numerical values. If a value is genuinely required, ask for it.
14. Always end numerical problems with:
   FINAL ANSWER: <answer>

RESPONSE STYLE:
- Easy language
- Short paragraphs
- Step-by-step when needed
- No unnecessary repetition
- Highlight important formulas and final answers"""
                })
                
                if conversation_history:
                    for conv in conversation_history[-10:]:
                        messages.append({"role": "user", "content": conv.user_message})
                        messages.append({"role": "assistant", "content": conv.ai_response})
                
                messages.append({"role": "user", "content": message})
                
                response = self.client.chat.completions.create(
                    model=settings.openai_model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1000
                )
                
                return response.choices[0].message.content
            
            else:
                return "No AI provider configured."
            
        except Exception as e:
            return f"Error: {str(e)}"

ai_service = AIService()
