content = open('StudentInfo.tsx', 'r', encoding='utf-8').read()
idx = content.rfind('// Compliance Section Component')
if idx > 0:
    content = content[:idx]
    open('StudentInfo.tsx', 'w', encoding='utf-8').write(content)
    print('Removed old component')
