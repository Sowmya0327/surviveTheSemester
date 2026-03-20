import small from '../../../../../../common/src/maps/small.json';
import gigantic from '../../../../../../common/src/maps/gigantic.json';

export const SpriteSheets: { [key: string]: string } = {
    'dungeon.png': '/dungeon.png', 
};

// 3. Export everything so the game engine can find it
export const MapList: any = {
    small,
    gigantic,
};