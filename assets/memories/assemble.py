from PIL import Image
import os, glob

event = 1
page = 1
gif = 1

while event <= 9:
    if page >= 6:
        page = 1
    while page <=5:
        base = Image.open('MMR_MAIN_BD.png').convert('RGBA')
        with Image.open(f'MMR_EVENT_BG_{event:02d}.png').convert('RGBA') as layer:
            base.paste(layer, (211, 128), mask=layer)
        with Image.open(f'MMR_PHOTO_{event:02d}_{page}.png').convert('RGBA') as layer:
                    base.paste(layer, (177, 57), mask=layer)
        with Image.open(f'smith_{event:02d}.png').resize((347, 266), resample=Image.LANCZOS).convert('RGBA') as layer:
            base.paste(layer, (398, 193), mask=layer)
        with Image.open(f'MMR_EVENT_{event:02d}.png').rotate(7.3, resample=3, expand=True).convert('RGBA') as layer:
            base.paste(layer, (19, -23), mask=layer)
        with Image.open(f'MMR_PAGE_{page:02d}.png').convert('RGBA') as layer:
            base.paste(layer, (559, 0), mask=layer)
        base.save(f'output/gif/{gif:02d}.png')
        gif += 1
        page += 1
    event += 1
