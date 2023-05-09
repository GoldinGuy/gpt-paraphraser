# Read in data
library(readr)
LING_227_Analysis_DATA <- read_csv("LING_227_Analysis_DATA.csv")
control_burstiness <- LING_227_Analysis_DATA$control_burstiness
test_burstiness <- LING_227_Analysis_DATA$test_burstiness
test_after_paraphraser_burstiness <- LING_227_Analysis_DATA$t_and_t_burstiness

# Calculate differences
data <- abs(test_burstiness - test_after_paraphraser_burstiness)

# Test for normality (assumption for paired t-test)
shapiro.test(data)
# P-value significant (0.0003016)! Let's use non-parametric methods instead

wilcox.test(test_burstiness, test_after_paraphraser_burstiness, paired = TRUE)
# P-value significant (3.052e-05)! We have statistical evidence that the 
# burstiness is drastically differenet before and after paraphrasing

# Make table for better use
wilcox_table <- data.frame(
  group = rep(c("test", "test_and_treatment"), each = 17),
  burstiness = c(test_burstiness, test_after_paraphraser_burstiness)
)

# Run Paired Samples Wilcoxon Test
wilcox.test(burstiness ~ group, data = wilcox_table, paired = TRUE, alternative = "less")
# Directional Wilcox table informs us that the before paraphrasing, the data
# has statistically significant less burstiness


# Let's see if control group has statistically-significant less burstiness then
# the paraphrased data
wilcox.test(control_burstiness,test_after_paraphraser_burstiness, alternative = "less")

# Wow! p-value = 0.04691, which means the paraphrased data had statistically
# significant more burstiness then the control group