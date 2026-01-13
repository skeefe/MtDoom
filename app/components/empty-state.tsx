"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createNewBattle } from "../../utils/create-battle";

interface EmptyStateProps {
    name: string;
    title: string;
    subtitle: React.ReactNode;
    type: "army" | "general";
}

const EmptyState = ({ name, title, subtitle, type }: EmptyStateProps) => {

    const router = useRouter();

    return (
        <div className="empty-state content">

            <div className="icon">
                {type === 'army' ? '⚔️' : '🎖️'}
            </div>
            <h2>{title}</h2>
            <p>{subtitle}</p>

            <button
                onClick={() => createNewBattle(router)}
                className="button button-primary"
            >
                {`Record ${name}'s First Battle`}
            </button>
        </div>
    );
};

export default EmptyState;