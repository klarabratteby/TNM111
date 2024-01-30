import csv
import tkinter as tk
from tkinter import ttk


class DataPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Read csv files


def read_data(file_path):
    with open(file_path, 'r') as file:
        csvreader = csv.reader(file)
        data = [row for row in csvreader]
    return data


data1 = read_data("data1.csv")
data2 = read_data("data2.csv")


def convert_to_float(value):
    try:
        return float(value)
    except ValueError:
        return None


# add data from csv files into a list
data = [DataPoint(convert_to_float(row[0]), convert_to_float(row[1]))
        for row in data1 + data2]

print()
'''
print("File 1:")
for row in data1:
    print(row)

print("File 2:")
for row in data2:
    print(row)
'''


class ScatterPlot:
    # Initializer
    def __init__(self, root, data):
        self.root = root  # main window
        self.data = data  # data
        self.canvas = tk.Canvas(root, width=800, height=800)  # Tkinter widget
        self.canvas.pack()  # packs the canvas within the main window

    # Draw the x- and y-axis and the ticks and tick values.
    def draw_axes_ticks(self):
        x_range, y_range = self.calculate_axis_ranges()

        # Convert x_range and y_range to integers
        x_range = int(x_range)
        y_range = int(y_range)

        # Draw x-axis
        self.canvas.create_line(50, 400, 750, 400, fill="black", width=5)
        self.canvas.create_text(700, 350, text="X-axis")

        # Draw y-axis
        self.canvas.create_line(400, 750, 400, 50, fill="black", width=5)
        self.canvas.create_text(350, 80, text="Y-axis")

        # Draw ticks and tick values on x-axis
        for i in range(-x_range, x_range+1, round(x_range*2/11)):
            x = round(400 + i*(350/x_range))
            self.canvas.create_line(x, 390, x, 410, width=1)
            self.canvas.create_text(round(x), 425, text=str(i))

        # Draw ticks and tick values on y-axis
        for i in range(-y_range, y_range+1, round(y_range*2/11)):
            y = round(400 - i*(350/y_range))
            self.canvas.create_line(390, y, 410, y, width=1)
            self.canvas.create_text(425, y, text=str(i))

    def calculate_axis_ranges(self):
        # Calculate x and y axis ranges based on data
        x_values = [point.x for point in self.data]
        y_values = [point.y for point in self.data]

        x_range = max(abs(min(x_values)), abs(max(x_values)))
        y_range = max(abs(min(y_values)), abs(max(y_values)))

        return x_range, y_range

    def calculate_tick_interval(self, axis_range):
        # Calculate tick interval based on axis range
        return round(axis_range * 2 / 11)
    '''
    def convert_to_canvas_coordinates(self, value, axis_range):
        # Convert data value to canvas coordinates
        return round(400 - value * (350 / axis_range))
    '''


# Example usage
root = tk.Tk()
root.title("Scatter Plot")
scatter_plot = ScatterPlot(root, data)  # Assuming 'data' is defined
scatter_plot.draw_axes_ticks()
root.mainloop()

'''
        # Draw legend
    def draw_legend(self):

        # Draw a data point with specified color, shape, and category
    def draw_data_points(self, x, y, color, shape, category):

        # Display the categorical information of the data points by using different shapes to represent the points.
    def display_categorical_info(self):

        # Display the data points correctly for the axes.
    def display_data_points(self):

        # Set the value range automatically based on the data values present in the data set.
    def set_value_range(self):
'''
