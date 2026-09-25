with open("server.ts", "r", encoding="utf-8") as f:
    text = f.read()

old_func_start = '''function getCoachSmartFallback(message: string): string {
  // If wrapped in prompt template, extract student's actual question:
  let studentText = message;
  if (message.includes("سؤال الطالب:")) {
    studentText = message.split("سؤال الطالب:").pop() || message;
  }
  const msg = (studentText + " " + message).toLowerCase();'''

new_func_start = '''function getCoachSmartFallback(message: string): string {
  // If wrapped in prompt template, extract student's actual question:
  let studentText = message;
  if (message.includes("سؤال الطالب:")) {
    studentText = message.split("سؤال الطالب:").pop() || message;
  }
  const msg = studentText.toLowerCase();'''

text = text.replace(old_func_start, new_func_start)

# Fix the cooking keywords so 'مل' does not trigger on 'ملفات' or 'ملازم'
old_cooking_cond = 'if (msg.includes("طبخ") || msg.includes("وصف") || msg.includes("مقادير") || msg.includes("جرام") || msg.includes("غرام") || msg.includes("مل") || msg.includes("بهار") || msg.includes("طعام") || msg.includes("حلويات") || msg.includes("مطبخ") || msg.includes("طهي") || msg.includes("أرز") || msg.includes("كيك")) {'
new_cooking_cond = 'if (msg.includes("طبخ") || msg.includes("وصفة") || msg.includes("وصفات") || msg.includes("مقادير") || msg.includes("جرام") || msg.includes("غرام") || msg.includes("مليلتر") || msg.includes("بهارات") || msg.includes("طعام") || msg.includes("حلويات") || msg.includes("مطبخ") || msg.includes("طهي") || msg.includes("أرز") || msg.includes("كيك")) {'

text = text.replace(old_cooking_cond, new_cooking_cond)

with open("server.ts", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated cooking keywords successfully!")
