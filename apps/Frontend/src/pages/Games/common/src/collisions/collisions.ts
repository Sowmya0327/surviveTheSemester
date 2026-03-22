import RBush from "rbush";

import { COLLISION_TYPES, CollisionType } from "./types";
import { CircleBody, RectangleBody } from "../geometry";
import { circleToRectangleSide, rectangleToRectangleSide } from ".";

type ColliderNode = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    collider: string;
    type?: number;
};

export class TreeCollider extends RBush {
    constructor() {
        super(8); // max entries per node (tuneable)
    }

    // ---------------------------
    // Utils
    // ---------------------------

    private intersects(a: ColliderNode, b: ColliderNode): boolean {
        return !(
            a.maxX < b.minX ||
            a.minX > b.maxX ||
            a.maxY < b.minY ||
            a.minY > b.maxY
        );
    }

    // ---------------------------
    // Collisions
    // ---------------------------

    collidesWithRectangle(body: RectangleBody, type?: CollisionType): boolean {
        const query: ColliderNode = {
            minX: body.left,
            minY: body.top,
            maxX: body.right,
            maxY: body.bottom,
            collider: "",
        };

        const leaves = this.search(query) as ColliderNode[];

        for (const wall of leaves) {
            if (type && wall.collider !== type) continue;

            if (this.intersects(query, wall)) {
                return true;
            }
        }

        return false;
    }

    collidesWithCircle(body: CircleBody, type?: CollisionType): boolean {
        const query: ColliderNode = {
            minX: body.left,
            minY: body.top,
            maxX: body.right,
            maxY: body.bottom,
            collider: "",
        };

        const leaves = this.search(query) as ColliderNode[];

        for (const wall of leaves) {
            if (type && wall.collider !== type) continue;

            if (this.intersects(query, wall)) {
                return true;
            }
        }

        return false;
    }

    // ---------------------------
    // Searches
    // ---------------------------

    searchWithRectangle(body: RectangleBody): ColliderNode[] {
        return this.search({
            minX: body.left,
            minY: body.top,
            maxX: body.right,
            maxY: body.bottom,
        }) as ColliderNode[];
    }

    searchWithCircle(body: CircleBody): ColliderNode[] {
        return this.search({
            minX: body.left,
            minY: body.top,
            maxX: body.right,
            maxY: body.bottom,
        }) as ColliderNode[];
    }

    // ---------------------------
    // Corrections
    // ---------------------------

    correctWithRectangle(body: RectangleBody): RectangleBody {
        const leaves = this.searchWithRectangle(body);
        if (!leaves.length) return body;

        const updatedBody = body.copy();
        const leafBody = new RectangleBody(0, 0, 0, 0);

        for (const wall of leaves) {
            if (!COLLISION_TYPES.includes(wall.collider)) continue;

            leafBody.x = wall.minX;
            leafBody.y = wall.minY;
            leafBody.width = wall.maxX - wall.minX;
            leafBody.height = wall.maxY - wall.minY;

            const side = rectangleToRectangleSide(updatedBody, leafBody);

            switch (side) {
                case "left":
                    updatedBody.right = leafBody.left;
                    break;
                case "top":
                    updatedBody.bottom = leafBody.top;
                    break;
                case "right":
                    updatedBody.left = leafBody.right;
                    break;
                case "bottom":
                    updatedBody.top = leafBody.bottom;
                    break;
            }
        }

        return updatedBody;
    }

    correctWithCircle(body: CircleBody): CircleBody {
        const leaves = this.searchWithCircle(body);
        if (!leaves.length) return body;

        const updatedBody = body.copy();
        const leafBody = new RectangleBody(0, 0, 0, 0);

        for (const wall of leaves) {
            if (!COLLISION_TYPES.includes(wall.collider)) continue;

            leafBody.x = wall.minX;
            leafBody.y = wall.minY;
            leafBody.width = wall.maxX - wall.minX;
            leafBody.height = wall.maxY - wall.minY;

            const side = circleToRectangleSide(updatedBody, leafBody); // ✅ fixed

            switch (side) {
                case "left":
                    updatedBody.right = leafBody.left;
                    break;
                case "top":
                    updatedBody.bottom = leafBody.top;
                    break;
                case "right":
                    updatedBody.left = leafBody.right;
                    break;
                case "bottom":
                    updatedBody.top = leafBody.bottom;
                    break;
            }
        }

        return updatedBody;
    }

    // ---------------------------
    // Getters
    // ---------------------------

    getAllByType(type: number): RectangleBody[] {
        return (this.all() as ColliderNode[])
            .filter((wall) => wall.type === type)
            .map(
                (wall) =>
                    new RectangleBody(
                        wall.minX,
                        wall.minY,
                        wall.maxX - wall.minX,
                        wall.maxY - wall.minY
                    )
            );
    }
}