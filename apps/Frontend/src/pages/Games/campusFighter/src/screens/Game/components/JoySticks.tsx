import { Maths } from '../../../../../common/src';
import React, { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import { View } from '../../../components';

export interface JoystickDirections {
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
}

interface JoySticksProps {
    onLeftMove: (directions: JoystickDirections) => void;
    onLeftRelease: () => void;
    onRightMove: (rotation: number) => void;
    onRightRelease: () => void;
}

export function JoySticks({
    onLeftMove,
    onLeftRelease,
    onRightMove,
    onRightRelease,
}: JoySticksProps) {
    const leftRef = useRef<HTMLDivElement | null>(null);
    const rightRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!leftRef.current || !rightRef.current) return;

        // LEFT JOYSTICK (movement)
        const leftJoystick = nipplejs.create({
            zone: leftRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white',
        });

        leftJoystick.on('move', (_: any, data: any) => {
            if (!data?.angle) return;

            const cardinal = Maths.degreeToCardinal(data.angle.degree);

            const up = ['NW', 'N', 'NE'].includes(cardinal);
            const right = ['NE', 'E', 'SE'].includes(cardinal);
            const down = ['SE', 'S', 'SW'].includes(cardinal);
            const left = ['SW', 'W', 'NW'].includes(cardinal);

            onLeftMove({ up, right, down, left });
        });

        leftJoystick.on('end', () => {
            onLeftRelease();
        });

        // RIGHT JOYSTICK (rotation + shoot)
        const rightJoystick = nipplejs.create({
            zone: rightRef.current,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'white',
        });

        rightJoystick.on('move', (_: any, data: any) => {
            if (!data?.angle) return;

            const radians = Maths.round2Digits(data.angle.radian - Math.PI);

            let rotation = 0;

            if (radians < 0) {
                rotation = Maths.reverseNumber(radians, -Math.PI, 0);
            } else {
                rotation = Maths.reverseNumber(radians, 0, Math.PI);
            }

            onRightMove(rotation);
        });

        rightJoystick.on('end', () => {
            onRightRelease();
        });

        return () => {
            leftJoystick.destroy();
            rightJoystick.destroy();
        };
    }, []);

    return (
        <View fullscreen>
            {/* LEFT */}
            <div
                ref={leftRef}
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '20%',
                    width: 120,
                    height: 120,
                }}
            />

            {/* RIGHT */}
            <div
                ref={rightRef}
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '20%',
                    width: 120,
                    height: 120,
                }}
            />
        </View>
    );
}