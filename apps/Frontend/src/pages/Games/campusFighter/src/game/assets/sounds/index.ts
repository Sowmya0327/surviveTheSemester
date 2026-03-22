import { Howl, Howler } from 'howler';
//@ts-ignore
import explosion from "./explosion.ogg";
//@ts-ignore
import fire from "./fire.ogg"
//@ts-ignore
import footstep from "./footstep.ogg"

Howler.volume(1.0);

const ExplosionSound = new Howl({
    src: [explosion],
    loop: false,
    preload: true,
});

const FireSound = new Howl({
    src: [fire],
    loop: true,
    preload: true,
});

const FootstepSound = new Howl({
    src: [footstep],
    loop: true,
    preload: true,
});

export { ExplosionSound, FireSound, FootstepSound };
