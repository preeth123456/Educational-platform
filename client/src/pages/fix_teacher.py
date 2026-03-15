content = open('TeacherInfo.tsx', 'r', encoding='utf-8').read()
idx = content.rfind('// Compliance Section Component for Teachers')
if idx > 0:
    content = content[:idx]
    open('TeacherInfo.tsx', 'w', encoding='utf-8').write(content)
    print('Removed old component')
