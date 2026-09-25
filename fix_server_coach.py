with open("server.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure studentText extraction is present in getCoachSmartFallback
old_fallback_start = 'function getCoachSmartFallback(message: string): string {'
new_fallback_start = '''function getCoachSmartFallback(message: string): string {
  // If wrapped in prompt template, extract student's actual question:
  let studentText = message;
  if (message.includes("سؤال الطالب:")) {
    studentText = message.split("سؤال الطالب:").pop() || message;
  }
  const msg = (studentText + " " + message).toLowerCase();'''

if old_fallback_start in content and "studentText" not in content:
    content = content.replace(old_fallback_start, new_fallback_start)
    with open("server.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Enhanced getCoachSmartFallback in server.ts")
else:
    print("Already updated or not found")
