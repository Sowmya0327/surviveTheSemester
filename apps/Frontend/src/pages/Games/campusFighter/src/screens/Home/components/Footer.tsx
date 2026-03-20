import React from 'react';
import { Inline, View } from '../../../components';
import { Text } from '../../../components/Text';
import { Icons } from '../../../icons';

const version = "1.0.0"
const URL = 'https://github.com/halftheopposite/tosios';

export function Footer(): React.ReactElement {
    return (
        <a href={URL}>
            <View
                flex
                center
                style={{
                    color: 'white',
                    fontSize: 14,
                }}
            >
                <img src={Icons.github} />
                <Inline size="xxs" />
                <Text>GitHub (v{version})</Text>
            </View>
        </a>
    );
}
