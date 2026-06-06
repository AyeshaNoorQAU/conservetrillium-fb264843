
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE post_author UUID;
BEGIN
  SELECT author_id INTO post_author FROM public.posts WHERE id = NEW.post_id;
  IF post_author IS NOT NULL AND post_author <> NEW.author_id THEN
    INSERT INTO public.notifications (user_id, kind, payload)
    VALUES (post_author, 'comment', jsonb_build_object('post_id', NEW.post_id, 'comment_id', NEW.id));
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER post_comments_notify
AFTER INSERT ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

CREATE OR REPLACE FUNCTION public.notify_on_like()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE post_author UUID;
BEGIN
  SELECT author_id INTO post_author FROM public.posts WHERE id = NEW.post_id;
  IF post_author IS NOT NULL AND post_author <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, kind, payload)
    VALUES (post_author, 'like', jsonb_build_object('post_id', NEW.post_id));
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER post_likes_notify
AFTER INSERT ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.notify_on_like();

CREATE OR REPLACE FUNCTION public.notify_on_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, kind, payload)
  SELECT cm.user_id, 'message', jsonb_build_object('conversation_id', NEW.conversation_id, 'message_id', NEW.id)
  FROM public.conversation_members cm
  WHERE cm.conversation_id = NEW.conversation_id AND cm.user_id <> NEW.author_id;
  RETURN NEW;
END $$;

CREATE TRIGGER messages_notify
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.notify_on_message();
