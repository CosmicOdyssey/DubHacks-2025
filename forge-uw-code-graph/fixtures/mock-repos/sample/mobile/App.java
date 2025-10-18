package edu.uw.mobile;

public class App {
  public void bootstrap() {
    log("Bootstrapping mobile services");
  }

  public int computeCredits(int enrolled, int completed) {
    if (completed == 0) {
      return 0;
    }
    return (int) Math.round((double) enrolled / completed * 10);
  }

  private void log(String message) {
    System.out.println(message);
  }
}
