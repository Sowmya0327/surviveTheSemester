import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as PIXI from 'pixi.js'; 
import { GameScreen } from "./src/screens/Game/Game";
import { HomeScreen } from "./src/screens/Home/Home";
// eslint-disable-next-line import/no-extraneous-dependencies
import "./campusFighter.css";

export default function CampusFighter() {
    useEffect(() => {
        if (!localStorage.getItem("playerName")) {
            localStorage.setItem("playerName", "Player");
        }
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ROUND_PIXELS = true;

    }, []);

    return (
        <div className="campus-fighter-wrapper">
            <BrowserRouter>
                <Routes>
                    <Route path="/campusFighter/" element={<HomeScreen />} />
                    <Route path="campusFighter/:roomId" element={<GameScreen />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}