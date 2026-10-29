from pathlib import Path
p=Path('dist/index.html');s=p.read_text(encoding='utf-8');s=s.replace('<nav id="tabs"','<p><a href="flashcards/" style="color:#286b59;font-weight:700">✦ 填空閃卡練習 →</a></p><nav id="tabs"');p.write_text(s,encoding='utf-8')
