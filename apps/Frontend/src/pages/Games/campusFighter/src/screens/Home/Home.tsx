// home.tsx
import { Constants, Types } from '../../../../common/src';
import { GameMode } from '../../../../common/src/types';
import { Client, RoomAvailable } from 'colyseus.js';
import qs from 'querystringify';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Separator, Space, View } from '../../components';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { NameField } from './components/NameField';
import { NewGameField } from './components/NewGameField';
import { RoomsList } from './components/RoomsList';

export function HomeScreen() {
    const [rooms, setRooms] = useState<RoomAvailable[]>([]);
    const clientRef = useRef<Client | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const navigate = useNavigate();

    //
    // Lifecycle
    //
    useEffect(() => {
        // Only initialize client once (React 18+ Strict Mode runs useEffect twice in dev)
        if (!clientRef.current) {
            // Explicitly point to the backend server port in development
            const url = import.meta.env.DEV 
                ? "ws://localhost:3000" 
                : `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

            clientRef.current = new Client(url);
        }

        intervalRef.current = setInterval(updateRooms, Constants.ROOM_REFRESH);
        updateRooms();

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    //
    // Utils
    //
    async function updateRooms() {
        try {
            // This is the correct way in modern Colyseus
            const res = await fetch("http://localhost:3000/api/games/campusFighter/rooms");
            const data = await res.json();
            setRooms(data);
        } catch (err) {
            console.error("Failed to fetch rooms:", err);
        }
    }

    //
    // Handlers
    //
    function handleRoomCreate(name: string, maxPlayers: number, map: string, mode: string) {
        const playerName = localStorage.getItem('playerName') || '';
        const parsedMode = mode as GameMode;
        const options: Types.RoomOptions = {
            playerName,
            roomName: name,
            roomMap: map,
            roomMaxPlayers: maxPlayers,
            mode: parsedMode,
        };

        navigate(`/campusFighter/new?${qs.stringify(options, '')}`);
    }

    function handleRoomClick(roomId: string) {
        navigate(`/campusFighter/${roomId}`);
    }

    return (
        <View flex center style={{ padding: 32, flexDirection: 'column' }}>
            <Header />
            <Space size="m" />
            <NameField />
            <Space size="m" />

            <Box style={{ width: 500, maxWidth: '100%' }}>
                <NewGameField onCreate={handleRoomCreate} />
                <Space size="xxs" />
                <Separator />
                <Space size="xxs" />
                <RoomsList rooms={rooms} onRoomClick={handleRoomClick} />
                <Space size="xxs" />
            </Box>

            <Space size="m" />
            <Footer />
        </View>
    );
}