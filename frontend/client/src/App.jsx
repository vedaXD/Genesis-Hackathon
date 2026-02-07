import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Pages
import FeedPage from "@/pages/feed";
import CreatePage from "@/pages/create";
import DiscoverPage from "@/pages/discover";
import ProfilePage from "@/pages/profile";
import RewardsPage from "@/pages/rewards";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FeedPage} />
      <Route path="/create" component={CreatePage} />
      <Route path="/discover" component={DiscoverPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/rewards" component={RewardsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
