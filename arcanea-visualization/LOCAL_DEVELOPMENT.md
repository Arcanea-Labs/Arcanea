# Arcanea Visualization - Local Development Guide

This guide explains how to run and understand the local version of the Arcanea Mythology Visualization.

## How to View the Project

No complex setup is required. You can view the project by simply opening the `arcanea_landing.html` file in your web browser.

1.  Navigate to the `arcanea-visualization/public` directory in your file explorer.
2.  Double-click on `arcanea_landing.html` or right-click and choose "Open with" your preferred browser (e.g., Chrome, Firefox, Edge).

## File Structure

-   `arcanea_landing.html`: This is the main file you see. It contains all the HTML structure and modern CSS for the user interface, including the header, hero section, and the container for our visualization. It's designed to be a beautiful, self-contained landing page.

-   `visualization.js`: This script contains all the logic for the interactive graph. It uses the [D3.js](https://d3js.org/) library to draw the nodes (mythological figures) and links (their relationships).

## Key Changes for Local Development

To make this work seamlessly offline without needing a backend server, the following changes were made to `visualization.js`:

1.  **Embedded Data**: Instead of fetching data from an API (`/api/graph`), a sample set of mythology data (nodes and links) has been embedded directly into the `visualization.js` file. This allows the graph to render immediately without any network requests.

2.  **Simplified Logic**: The script was simplified to remove dependencies on specific HTML elements from the older design (like search bars and tooltips that no longer exist in the new UI). This prevents errors and ensures the script works perfectly with `arcanea_landing.html`.

3.  **Integrated Styling**: The colors and appearance of the graph nodes and links have been updated to match the new dark theme defined in `arcanea_landing.html`.

This setup provides a complete, interactive preview of the visualization that the community can run and explore on their local machines.
