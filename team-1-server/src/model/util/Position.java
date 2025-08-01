package model.util;

/**
 * Represents a 2D position with x and y coordinates
 */
public class Position {
    private int x;
    private int y;

    // Default constructor for Gson
    public Position() {
    }

    public Position(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Getters and Setters for Gson
    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    @Override
    public String toString() {
        return "Position{" + "x=" + x + ", y=" + y + '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Position position = (Position) obj;
        return x == position.x && y == position.y;
    }

    @Override
    public int hashCode() {
        return 31 * x + y;
    }
}
