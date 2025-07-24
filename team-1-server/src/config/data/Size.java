package config.data;

/**
 * Class for handling building dimensions
 */
public class Size {
    private int width;
    private int height;

    /**
     * Default constructor
     */
    public Size() {
        this.width = 0;
        this.height = 0;
    }

    /**
     * Constructor with width and height
     */
    public Size(int width, int height) {
        this.width = width;
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    @Override
    public String toString() {
        return "Size{" +
                "width=" + width +
                ", height=" + height +
                '}';
    }
}