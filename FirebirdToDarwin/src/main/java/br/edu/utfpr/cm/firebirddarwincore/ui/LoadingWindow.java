package br.edu.utfpr.cm.firebirddarwincore.ui;

import javax.swing.JFrame;
import javax.swing.JProgressBar;

public class LoadingWindow extends JFrame {

    JProgressBar progressBar = new JProgressBar();

    public LoadingWindow() {
        setupProgressBar();
        setupWindow();
    }

    private void setupWindow() {
        setTitle("Convertendo...");
        setLayout(null);
        setSize(560, 130);
        setResizable(false);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setVisible(true);
    }

    private void setupProgressBar() {
        progressBar.setBounds(20, 20, 500, 50);
        progressBar.setIndeterminate(true);
        progressBar.setStringPainted(true);
        progressBar.setString("Convertendo registros...");

        add(progressBar);
    }
}
