from typing import Dict

class CostTrackerService:
    def __init__(self):
        self.total_tokens = 0
        self.total_cost = 0.0
        # Placeholder rates
        self.input_rate = 0.01 / 1000  # $0.01 per 1k tokens
        self.output_rate = 0.03 / 1000 # $0.03 per 1k tokens

    def track_usage(self, input_tokens: int, output_tokens: int):
        self.total_tokens += (input_tokens + output_tokens)
        self.total_cost += (input_tokens * self.input_rate + output_tokens * self.output_rate)
        return {
            "query_tokens": input_tokens + output_tokens,
            "total_tokens": self.total_tokens,
            "total_cost": round(self.total_cost, 6)
        }
    def reset(self):
        self.total_tokens = 0
        self.total_cost = 0.0
